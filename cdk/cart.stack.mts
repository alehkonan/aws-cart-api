import path from 'node:path';
import url from 'node:url';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartVpc = new ec2.Vpc(this, 'CartVpc', {
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc: cartVpc,
      description: 'Security group for RDS instance',
    });

    const cartDatabase = new rds.DatabaseInstance(this, 'CartDatabase', {
      securityGroups: [dbSecurityGroup],
      allowMajorVersionUpgrade: true,
      vpc: cartVpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17_2,
      }),
      multiAz: false,
      publiclyAccessible: false,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO,
      ),
      databaseName: process.env.DB_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      credentials: rds.Credentials.fromPassword(
        process.env.DB_USER,
        cdk.SecretValue.unsafePlainText(process.env.DB_PASSWORD),
      ),
    });

    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      'LambdaSecurityGroup',
      {
        vpc: cartVpc,
        description: 'Security group for Lambda function',
      },
    );

    dbSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.POSTGRES);

    const cartApiHandler = new NodejsFunction(this, 'CartApiHandler', {
      vpc: cartVpc,
      securityGroups: [lambdaSecurityGroup],
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(dirname, '../dist/handler.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        forceDockerBundling: true,
        platform: 'linux/arm64',
        externalModules: ['@nestjs/*', 'pg*', 'sequelize*'],
        nodeModules: [
          '@nestjs/common',
          '@nestjs/config',
          '@nestjs/core',
          '@nestjs/jwt',
          '@nestjs/passport',
          '@nestjs/platform-express',
          '@nestjs/sequelize',
          'pg',
          'pg-hstore',
          'sequelize',
          'sequelize-typescript',
        ],
      },
      environment: {
        DB_HOST: cartDatabase.dbInstanceEndpointAddress,
        DB_PORT: cartDatabase.dbInstanceEndpointPort,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
      },
    });

    const cartApi = new apigateway.LambdaRestApi(this, 'CartApi', {
      handler: cartApiHandler,
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    new cdk.CfnOutput(this, 'CartApiUrl', {
      value: cartApi.url,
      description: 'Cart API Gateway URL',
    });
  }
}

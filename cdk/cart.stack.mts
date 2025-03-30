import path from 'node:path';
import url from 'node:url';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiHandler = new NodejsFunction(this, 'CartApiHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(dirname, '../dist/handler.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        forceDockerBundling: true,
        platform: 'linux/arm64',
        externalModules: ['@nestjs/*'],
        nodeModules: [
          '@nestjs/common',
          '@nestjs/config',
          '@nestjs/core',
          '@nestjs/jwt',
          '@nestjs/passport',
          '@nestjs/platform-express',
        ],
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

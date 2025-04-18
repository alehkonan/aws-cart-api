import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApi = new apigateway.RestApi(this, 'CartApi', {
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const cartApiIntegration = new apigateway.HttpIntegration(
      'http://alehkonan-cart-api-test.us-east-1.elasticbeanstalk.com/{proxy}',
      {
        proxy: true,
        httpMethod: 'ANY',
        options: {
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
          },
        },
      },
    );

    cartApi.root.addProxy({
      anyMethod: true,
      defaultIntegration: cartApiIntegration,
      defaultMethodOptions: {
        methodResponses: [{ statusCode: '200' }],
        requestParameters: {
          'method.request.path.proxy': true,
        },
      },
    });

    new cdk.CfnOutput(this, 'CartApiUrl', {
      value: cartApi.url,
      description: 'Cart API Gateway URL',
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import { CartStack } from './cart.stack.mts';

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

new CartStack(app, 'CartStack', { env });

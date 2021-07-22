# Amazon Web Services Cloud Development Kit (Part 2)

This project is a supplemental code guide to [Rivers Agile](https://riversagile.com) - 
[Amazon Web Services Cloud Development Kit (Part 2)](https://riversagile.com/aws-cdk-structure/) blog article.

Within this example project we have 2 stacks
1. Web Service Stack (Stack 1/WebStack) - [web-stack.ts](https://github.com/rivers-agile/aws-cdk-structure/blob/master/lib/web-stack.ts)
2. Build and Deploy Stack (Stack 2/DeployStack) - [deploy-stack.ts](https://github.com/rivers-agile/aws-cdk-structure/blob/master/lib/deploy-stack.ts)

Also included within this example project is a simple Node application ([example-node-project.zip](https://github.com/rivers-agile/aws-cdk-structure/blob/master/example-node-project.zip)) that uses Express and Pug.

Additional configuration can be found in the `cdk.json` file tells the CDK Toolkit how to execute your app.

## Bootstrap
The CDK S3 bucket will be test instead of the default cdk naming convention.

`cdk bootstrap --toolkit-stack-name Test`

## Deployment
Use the below syntax to deploy for each stack for the example project.

`cdk deploy WebStack --toolkit-stack-name Test`

`cdk deploy DeployStack --toolkit-stack-name Test`

## Cleanup
Use the below syntax to remove deployment and CloudFormation for each respective stacks for you example project.

`cdk destroy WebStack --toolkit-stack-name Test`

`cdk destroy DeployStack --toolkit-stack-name Test`

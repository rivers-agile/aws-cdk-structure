import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import {readFileSync} from "fs";

/*
WebStack is our Web Server deployment
It creates
- A virtual network
- Security rules
- Permissions for reading dependent assets (i.e., S3 via CodeDeploy)
- A web server via EC2 and post setup via user-data script located in ./lib/data/user-data.sh
 */
export class WebStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a VPC network where the Web Server exists
        const vpc = new ec2.Vpc(this, 'test-cdk-vpc', {
            cidr: '192.168.1.0/24',
            subnetConfiguration: [
                {name: 'Web VPC Subnet', cidrMask: 25, subnetType: ec2.SubnetType.PUBLIC}, // Define the details of the public subnet
            ],
        });

        // Security Group for the Web Server
        const securityGroup = new ec2.SecurityGroup(this, 'web-server-security-group', {
            vpc,
            allowAllOutbound: true, // Allow all network outbound traffic (common AWS Default)
        });

        // Allow inbound port rule for SSH via port 22
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            'SSH Access',
        );

        // Allow inbound port rule for Web Access via port 80
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'Web Access',
        );

        // Role for the Web Server
        // Adding S3 access for CodeBuild deployment reasons
        const role = new iam.Role(this, 'web-server-role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
            ],
        });

        // Create our Web Server
        const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
            vpc, // The new VPC of 192.168.1.0/24 CIDR notation
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC, // All network is allowed to be public
            },
            role, // S3 Read Only role for CodeBuild deployment via CodePipeline
            securityGroup, // Inbound and outbound networking rules
            instanceType: ec2.InstanceType.of( // Free t2.micro instance (AWS free tier eligible)
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO,
            ),
            machineImage: new ec2.AmazonLinuxImage({ // Linux 2 (AWS free tier eligible)
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            keyName: 'test', // Replace this key with you Key Pairs via Network and Security on AWS Console EC2 Dashboard
        });

        // Get user data script. Called when EC2 instance is created
        const userDataScript = readFileSync('./lib/data/user-data.sh', 'utf8');
        // Assign EC2 user data to script
        ec2Instance.addUserData(userDataScript);
    }
}

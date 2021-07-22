import * as cdk from "@aws-cdk/core";
import * as code from "@aws-cdk/aws-codecommit";
import * as pipeline from "@aws-cdk/aws-codepipeline";
import * as actions from "@aws-cdk/aws-codepipeline-actions";
import {CodeCommitTrigger} from "@aws-cdk/aws-codepipeline-actions";
import * as deploy from "@aws-cdk/aws-codedeploy";

/*
DeployStack is our CodePipeline environment
It creates
- CodeCommit repository named example-node-project
- CodeDeploy action to map to deployed resources based on tag of Name
- Security rules for deploying to EC2 Instance
- A bucket (default encrypted) from deploy stack as a Pipeline artifact
 */
export class DeployStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create our CodeCommit repository
        const repository = new code.Repository(this, "my-project-repo", {
            repositoryName:"example-node-project"
        });

        // Our S3 bucket for Pipeline artifacts
        const output = new pipeline.Artifact("Output");

        // Define where the EC2 stack goes based on the tag Name of "WebStack/ec2-instance" which is the default for web-stack.ts
        const ec2InstanceTags = new deploy.InstanceTagSet({"Name": ["WebStack/ec2-instance"]})

        const deploymentGroup = new deploy.ServerDeploymentGroup(this, "test-web-deploy", {
            ec2InstanceTags,
            installAgent: true,

        })

        // Complete Pipeline Project
        new pipeline.Pipeline(this, "Pipeline", {
            restartExecutionOnUpdate: true, // Run the pipeline automatically if updated
            stages: [
                {
                    stageName: "Source",
                    actions: [
                        new actions.CodeCommitSourceAction({
                            actionName: "CodeCommit",
                            branch: "master",
                            repository,
                            output,
                            trigger: CodeCommitTrigger.POLL // Periodically check for changes
                        }),
                    ],
                },
                {
                    stageName: "Deploy",
                    actions: [
                        new actions.CodeDeployServerDeployAction({
                            actionName: "CodeDeploy",
                            input: output,
                            deploymentGroup // Deploy to particular machines matching the EC2 instance name tag
                        }),
                    ],
                }
            ],
        });
    }
}

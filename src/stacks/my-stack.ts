import { join } from "path";
import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Architecture, LoggingFormat, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  StateMachine,
  DefinitionBody,
  StateMachineType,
  LogLevel,
} from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import { SampleStateMachine } from "../state-machines/projen/sample-statemachine";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const helloLambda = new NodejsFunction(this, `HelloLambda`, {
      functionName: `hello-lambda`,
      entry: join(__dirname, "..", "functions/hello", "index.ts"),
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      timeout: Duration.minutes(1),
      loggingFormat: LoggingFormat.JSON,
    });

    // Create state machine (CDK method)
    const cdkStateMachine = new StateMachine(this, "CdkStateMachine", {
      stateMachineName: `cdk-state-machine`,
      definitionBody: DefinitionBody.fromFile(
        join(__dirname, "..", "state-machines", "cdk", "sample.asl.json"),
      ),
      definitionSubstitutions: {
        HELLO_LAMBDA_FUNCTION_NAME: helloLambda.functionName,
      },
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: new LogGroup(this, "CdkStateMachineLogGroup"),
        level: LogLevel.ALL,
        includeExecutionData: true,
      },
    });

    // Create state machine (Projen method)
    const projenStateMachine = new SampleStateMachine(
      this,
      "ProjenStateMachine",
      {
        stateMachineName: "projen-state-machine",
        overrides: {
          "Execute function": {
            Parameters: {
              FunctionName: helloLambda.functionName,
            },
          },
        },
        stateMachineType: StateMachineType.EXPRESS,
        logs: {
          destination: new LogGroup(this, "ProjenStateMachineLogGroup"),
          level: LogLevel.ALL,
          includeExecutionData: true,
        },
      },
    );

    // Grant state machines the permission to invoke Lambda function
    helloLambda.grantInvoke(cdkStateMachine);
    helloLambda.grantInvoke(projenStateMachine);
  }
}

import { StepFunctionsAutoDiscover } from "@matthewbonig/state-machine";
import { awscdk, javascript } from "projen";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.147.2",
  defaultReleaseBranch: "main",
  depsUpgradeOptions: { workflow: false },
  eslint: true,
  minNodeVersion: "20.15.0",
  name: "cdk-aws-sfn-cdk-vs-projen",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "9.4.0",
  prettier: true,
  projenrcTs: true,

  deps: [
    "@types/aws-lambda",
    "@aws-lambda-powertools/logger",
    "@middy/core",
    "@middy/http-error-handler",
  ],
  devDeps: ["@matthewbonig/state-machine"],
});

// Looks for `.workflow.json` files and generates `StateMachine` constructs
new StepFunctionsAutoDiscover(project);

project.synth();

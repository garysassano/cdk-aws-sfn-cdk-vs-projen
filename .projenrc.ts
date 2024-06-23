import { StepFunctionsAutoDiscover } from "@matthewbonig/state-machine";
import { awscdk, javascript } from "projen";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.174.0",
  defaultReleaseBranch: "main",
  depsUpgradeOptions: { workflow: false },
  devDeps: ["@matthewbonig/state-machine"],
  eslint: true,
  minNodeVersion: "22.12.0",
  name: "cdk-aws-sfn-cdk-vs-projen",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "9",
  prettier: true,
  projenrcTs: true,

  deps: [
    "@aws-lambda-powertools/logger",
    "@middy/core",
    "@middy/http-error-handler",
    "@types/aws-lambda",
  ],
});

// Looks for `.workflow.json` files and generates `StateMachine` constructs
new StepFunctionsAutoDiscover(project);

project.synth();

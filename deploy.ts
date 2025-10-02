import {
  CloudFrontDistributionConfigurator,
  getCloudFrontDistributionConfig,
  getCloudFrontFunctionARN,
  logger,
  publishCloudFrontFunction,
  readFile,
  updateCloudFrontDistribution,
  updateCloudFrontFunctionCode,
  updateLambdaFunctionCode,
  yamlToJson
} from './lib';
import * as fs from 'fs';

(async () => {
  try {
    const cloudFrontUserConfig = yamlToJson(
      Buffer.from((await readFile('./config/cloudfront.yaml')) as Buffer).toString()
    ) as CloudFrontFunctionAssocationsConfig;

    for (const distributionId in cloudFrontUserConfig) {
      const { DistributionConfig: distributionConfig } = {
        ...(await getCloudFrontDistributionConfig(distributionId))
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const distributionConfigurator = new CloudFrontDistributionConfigurator(distributionConfig!);

      const cacheBehaviorConfigs = cloudFrontUserConfig[distributionId];
      for (const cacheBehaviorConfig of cacheBehaviorConfigs) {
        const {
          behavior: cacheBehaviorName,
          lambdaAssociations: lambdaFunctions,
          functionAssociations: cloudFrontFunctions
        } = cacheBehaviorConfig;

        // remove any existing associations that have been removed from the user config based on event type
        for (const eventType of ['viewer-request', 'viewer-response', 'origin-request', 'origin-response'] as any) {
          if (typeof lambdaFunctions.find((association) => association.eventType === eventType) === 'undefined') {
            distributionConfigurator.removeLambdaFunctionAssociation({
              cacheBehaviorName,
              eventType
            });
          }
          if (typeof cloudFrontFunctions.find((association) => association.eventType === eventType) === 'undefined') {
            distributionConfigurator.removeCloudFrontFunctionAssociation({
              cacheBehaviorName,
              eventType
            });
          }
        }

        // update Lambda@Edge & CloudFront Function code and config associations
        for (const lambdaFunction of lambdaFunctions) {
          const { functionName, eventType, includeBody, filePath } = lambdaFunction;
          const functionArn = (await updateLambdaFunctionCode(functionName, filePath))?.FunctionArn;
          if (typeof functionArn === 'string' && functionArn.length > 0) {
            distributionConfigurator.addLambdaFunctionAssociation({
              cacheBehaviorName,
              lambdaFunctionARN: functionArn,
              eventType,
              includeBody
            });
          }
        }
        for (const cloudFrontFunction of cloudFrontFunctions) {
          const { functionName, eventType, filePath } = cloudFrontFunction;
          const functionARN = await getCloudFrontFunctionARN(functionName);
          if (typeof functionARN === 'string' && functionARN.length > 0) {
            await updateCloudFrontFunctionCode(functionName, filePath);
            await publishCloudFrontFunction(functionName);
            distributionConfigurator.addCloudFrontFunctionAssociation({
              cacheBehaviorName,
              functionARN,
              eventType
            });
          }
        }
      }

      // validate CloudFront Distribution config
      distributionConfigurator.validate();

      // deploy updated CloudFront distribution config
      // wait for Lambda@Edge functions to replicate
      logger.info('Waiting 60 seconds for functions to replicate...');
      await new Promise((resolve) => {
        setTimeout(resolve, 60000);
      });
      fs.writeFileSync('./cf-config.json', Buffer.from(JSON.stringify(distributionConfig), 'utf8'));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await updateCloudFrontDistribution(distributionId, distributionConfig!);
    }
  } catch (error: unknown) {
    logger.error(error);
    process.exit(1);
  }
})();

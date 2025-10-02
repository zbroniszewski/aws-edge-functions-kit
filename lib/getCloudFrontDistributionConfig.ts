import { GetDistributionConfigCommand } from '@aws-sdk/client-cloudfront';
import { cloudFrontDistributionConfigs } from './cloudFrontDistributionConfigs';
import { getCloudFrontClient } from './getCloudFrontClient';
import { logger } from './logger';

const cloudFrontClient = getCloudFrontClient('us-east-1');

export async function getCloudFrontDistributionConfig(distributionId: string, useCache = true) {
  if (useCache) {
    // lookup config
    if (!cloudFrontDistributionConfigs[distributionId]) {
      // config is not indexed, make fresh request for config without cache
      const _cloudfrontDistributionConfig = await getCloudFrontDistributionConfig(distributionId, false);
      if (_cloudfrontDistributionConfig !== undefined) {
        // index valid config
        cloudFrontDistributionConfigs[distributionId] = _cloudfrontDistributionConfig;
      }
    }
    return cloudFrontDistributionConfigs[distributionId];
  }

  const command = new GetDistributionConfigCommand({
    Id: distributionId
  });

  try {
    const response = await cloudFrontClient.send(command);
    return response;
  } catch (error: any) {
    if (error?.requestId || error?.cfId || error?.extendedRequestId) {
      logger.error(
        {
          requestId: error.requestId,
          cfId: error.cfId,
          extendedRequestId: error.extendedRequestId
        },
        `Failed to getCloudFrontDistributionConfig (${distributionId}).`
      );
    }

    throw new Error(error);
  }
}

import { getCloudFrontClient } from './getCloudFrontClient';
import { DistributionConfig, UpdateDistributionCommand } from '@aws-sdk/client-cloudfront';
import { getCloudFrontDistributionConfig } from './getCloudFrontDistributionConfig';

const cloudFrontClient = getCloudFrontClient('us-east-1') as any;

export async function updateCloudFrontDistribution(distributionId: string, distributionConfig: DistributionConfig) {
  const etag = (await getCloudFrontDistributionConfig(distributionId)).ETag;

  const command = new UpdateDistributionCommand({
    Id: distributionId,
    IfMatch: etag,
    DistributionConfig: distributionConfig
  });

  const response = await cloudFrontClient.send(command);
  return response;
}

import { DescribeFunctionCommand } from '@aws-sdk/client-cloudfront';
import { getCloudFrontClient } from './getCloudFrontClient';
import { logger } from './logger';

const cloudFrontClient = getCloudFrontClient('us-east-1');

export async function getCloudFrontFunctionETag(functionName: string, stage: 'DEVELOPMENT' | 'LIVE') {
  const command = new DescribeFunctionCommand({
    Name: functionName,
    Stage: stage
  });

  try {
    const response = await cloudFrontClient.send(command);
    return response.ETag;
  } catch (error: any) {
    if (error?.requestId || error?.cfId || error?.extendedRequestId) {
      logger.error(
        {
          requestId: error.requestId,
          cfId: error.cfId,
          extendedRequestId: error.extendedRequestId
        },
        `Failed to getCloudFrontFunctionETag (${functionName}).`
      );
    }

    throw new Error(error);
  }
}

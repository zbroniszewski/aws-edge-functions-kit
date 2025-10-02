import { getCloudFrontClient } from './getCloudFrontClient';
import { getCloudFrontFunctionETag } from './getCloudFrontFunctionETag';
import { logger } from './logger';
import { PublishFunctionCommand } from '@aws-sdk/client-cloudfront';

const cloudFrontClient = getCloudFrontClient('us-east-1');

export async function publishCloudFrontFunction(functionName: string) {
  const etag = await getCloudFrontFunctionETag(functionName, 'DEVELOPMENT');

  logger.info(etag);

  const command = new PublishFunctionCommand({
    Name: functionName,
    IfMatch: etag
  });

  try {
    await cloudFrontClient.send(command);
  } catch (error: any) {
    if (error?.requestId || error?.cfId || error?.extendedRequestId) {
      logger.error(
        {
          requestId: error.requestId,
          cfId: error.cfId,
          extendedRequestId: error.extendedRequestId
        },
        `Failed to publishCloudFrontFunction (${functionName}).`
      );
    }

    throw new Error(error);
  }
}

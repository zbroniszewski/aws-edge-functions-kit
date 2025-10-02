import { getCloudFrontClient } from './getCloudFrontClient';
import { getCloudFrontFunctionETag } from './getCloudFrontFunctionETag';
import { logger } from './logger';
import { UpdateFunctionCommand } from '@aws-sdk/client-cloudfront';
import { readFile } from './readFile';

const cloudFrontClient = getCloudFrontClient('us-east-1');

export async function updateCloudFrontFunctionCode(functionName: string, functionCodePath: string) {
  const etag = await getCloudFrontFunctionETag(functionName, 'DEVELOPMENT');
  logger.info(`updateFunction ETag: ${etag}`);
  const functionCode = await readFile(functionCodePath);

  const command = new UpdateFunctionCommand({
    Name: functionName,
    IfMatch: etag,
    FunctionConfig: {
      Comment: functionName,
      Runtime: 'cloudfront-js-1.0'
    },
    FunctionCode: functionCode as Uint8Array
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
        `Failed to updateCloudFrontFunctionCode (${functionName}).`
      );
    }

    throw new Error(error);
  }
}

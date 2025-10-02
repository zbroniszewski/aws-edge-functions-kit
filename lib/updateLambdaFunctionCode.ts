import { UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda';
import { getLambdaClient } from './getLambdaClient';
import { makeZipFile } from './makeZipFile';
import { readFile } from './readFile';

const lambdaClient = getLambdaClient('us-east-1');

export async function updateLambdaFunctionCode(functionName: string, functionCodeFilePath: string) {
  const functionCodeZipFilePath = makeZipFile(functionCodeFilePath);
  const functionCodeZipContents = await readFile(functionCodeZipFilePath);

  const command = new UpdateFunctionCodeCommand({
    FunctionName: functionName,
    ZipFile: functionCodeZipContents as Uint8Array,
    Publish: true
  });

  const response = await lambdaClient.send(command);

  // if (response?.State !== 'Pending' || response?.StateReasonCode !== 'Creating') {
  //   throw new Error(
  //     `Could not publish new Lambda function version (${functionName}). The code might not have changed since the last publish.`
  //   );
  // }

  return response;
}

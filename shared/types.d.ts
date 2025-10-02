type GetDistributionConfigCommandOutput = import('@aws-sdk/client-cloudfront').GetDistributionConfigCommandOutput;

type CloudFrontDistributionConfigs = {
  [key: string]: GetDistributionConfigCommandOutput;
};

type CloudFrontFunctionAssocationsConfig = {
  [key: string]: Array<{
    behavior: string;
    lambdaAssociations: Array<{
      functionName: string;
      eventType: 'viewer-request' | 'origin-request' | 'origin-response' | 'viewer-response';
      includeBody: boolean;
      filePath: string;
    }>;
    functionAssociations: Array<{
      functionName: string;
      eventType: 'viewer-request' | 'viewer-response';
      filePath: string;
    }>;
  }>;
};

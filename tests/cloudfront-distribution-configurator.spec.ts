import { CloudFrontDistributionConfigurator } from '../lib';
import { GetDistributionConfigResult as CloudFrontDistributionConfig } from '@aws-sdk/client-cloudfront';
import util from 'util';
import { CloudFrontDistributionConfigValidationError } from '../lib/CloudFrontDistributionConfigurator';

describe('CloudFrontDistributionConfigurator', () => {
  let testFailed = true;
  const configUnderTest: CloudFrontDistributionConfig = CloudFrontDistributionConfigurator.makeConfig();
  let cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(configUnderTest);

  beforeEach(() => {
    testFailed = true;
  });

  afterEach(() => {
    if (testFailed) {
      console.log(util.inspect(cloudFrontDistributionConfigurator.getConfig(), true, 6, true));
    }
  });

  test('Adding Lambda@Edge function associations', async () => {
    // Given: A CloudFront Distribution config with no edge function associations
    cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(
      JSON.parse(JSON.stringify(configUnderTest))
    );

    // When: Lambda@Edge function associations are added
    cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
      cacheBehaviorName: 'default',
      lambdaFunctionARN: 'foobar',
      eventType: 'viewer-request',
      includeBody: false
    });
    cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
      cacheBehaviorName: 'default',
      lambdaFunctionARN: 'foobar',
      eventType: 'viewer-response',
      includeBody: false
    });
    cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
      cacheBehaviorName: 'default',
      lambdaFunctionARN: 'foobar',
      eventType: 'origin-request',
      includeBody: false
    });
    cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
      cacheBehaviorName: 'default',
      lambdaFunctionARN: 'foobar',
      eventType: 'origin-response',
      includeBody: false
    });

    try {
      cloudFrontDistributionConfigurator.validate();
    } catch (error) {
      if (!(error instanceof CloudFrontDistributionConfigValidationError)) {
        console.error(error);
      }
    }

    // Then: The config should be valid
    expect(cloudFrontDistributionConfigurator.isValid()).toBe(true);

    // Then: The Lambda@Edge function associations should exist
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeDefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeDefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-request'
      })
    ).toBeDefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-response'
      })
    ).toBeDefined();

    // Then: No CloudFront Function associations should exist
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeUndefined();
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeUndefined();

    testFailed = false;
  });

  test('Adding CloudFront Function associations', async () => {
    // Given: A CloudFront Distribution config with no edge function associations
    cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(
      JSON.parse(JSON.stringify(configUnderTest))
    );

    try {
      // When: CloudFront Function associations are added
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-request'
      });
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-response'
      });

      cloudFrontDistributionConfigurator.validate();
    } catch (error) {
      if (!(error instanceof CloudFrontDistributionConfigValidationError)) {
        console.error(error);
      }
    }

    // Then: The config should be valid
    expect(cloudFrontDistributionConfigurator.isValid()).toBe(true);

    // Then: The CloudFront Function associations should exist
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeDefined();
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeDefined();

    // Then: No Lambda@Edge Function associations should exist
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeUndefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeUndefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-request'
      })
    ).toBeUndefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-response'
      })
    ).toBeUndefined();

    testFailed = false;
  });

  test('Adding invalid function combination (Lambda@Edge & CloudFront Function viewer events)', async () => {
    // Given: A CloudFront Distribution config with no edge function associations
    cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(
      JSON.parse(JSON.stringify(configUnderTest))
    );

    try {
      // When: CloudFront Function associations and Lambda@Edge viewer event associations are added
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-request'
      });
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-response'
      });
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'viewer-request',
        includeBody: false
      });
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'viewer-response',
        includeBody: false
      });

      cloudFrontDistributionConfigurator.validate();
    } catch (error) {
      if (!(error instanceof CloudFrontDistributionConfigValidationError)) {
        console.error(error);
      }
    }

    // Then: The config should be invalid
    expect(cloudFrontDistributionConfigurator.isValid()).toBe(false);

    testFailed = false;
  });

  test('Removing Lambda@Edge functions', async () => {
    cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(
      JSON.parse(JSON.stringify(configUnderTest))
    );

    try {
      // Given: A config with Lambda@Edge associations
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'viewer-request',
        includeBody: false
      });
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'viewer-response',
        includeBody: false
      });
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'origin-request',
        includeBody: false
      });
      cloudFrontDistributionConfigurator.addLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        lambdaFunctionARN: 'foobar',
        eventType: 'origin-response',
        includeBody: false
      });

      // When: 2 of the Lambda@Edge associations are removed
      cloudFrontDistributionConfigurator.removeLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      });
      cloudFrontDistributionConfigurator.removeLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-request'
      });

      cloudFrontDistributionConfigurator.validate();
    } catch (error) {
      if (!(error instanceof CloudFrontDistributionConfigValidationError)) {
        console.error(error);
      }
    }

    // Then: The config should be valid
    expect(cloudFrontDistributionConfigurator.isValid()).toBe(true);

    // Then: The functions that were removed should not exist
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeUndefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-request'
      })
    ).toBeUndefined();

    // Then: The functions that were not removed should exist
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeDefined();
    expect(
      cloudFrontDistributionConfigurator.getLambdaFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'origin-response'
      })
    ).toBeDefined();

    testFailed = false;
  });

  test('Removing CloudFront Functions', async () => {
    cloudFrontDistributionConfigurator = new CloudFrontDistributionConfigurator(
      JSON.parse(JSON.stringify(configUnderTest))
    );

    try {
      // Given: A config with CloudFront Function associations
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-request'
      });
      cloudFrontDistributionConfigurator.addCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        functionARN: 'foobar',
        eventType: 'viewer-response'
      });

      // When: 1 of the CloudFront Function associations are removed
      cloudFrontDistributionConfigurator.removeCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      });

      cloudFrontDistributionConfigurator.validate();
    } catch (error) {
      if (!(error instanceof CloudFrontDistributionConfigValidationError)) {
        console.error(error);
      }
    }

    // Then: The config should be valid
    expect(cloudFrontDistributionConfigurator.isValid()).toBe(true);

    // Then: The function that was removed should not exist
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-request'
      })
    ).toBeUndefined();

    // Then: The function that was not removed should exist
    expect(
      cloudFrontDistributionConfigurator.getCloudFrontFunctionAssociation({
        cacheBehaviorName: 'default',
        eventType: 'viewer-response'
      })
    ).toBeDefined();

    testFailed = false;
  });
});

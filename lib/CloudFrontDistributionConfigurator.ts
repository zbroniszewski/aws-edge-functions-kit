import type {
  DistributionConfig as CloudFrontDistributionConfig,
  EventType as CloudFrontEventType,
  DefaultCacheBehavior as CloudFrontDefaultCacheBehavior,
  CacheBehavior as CloudFrontCacheBehavior,
  LambdaFunctionAssociation as CloudFrontLambdaFunctionAssociation,
  FunctionAssociation as CloudFrontFunctionAssociation
} from '@aws-sdk/client-cloudfront';

export class CloudFrontDistributionConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CloudFrontDistributionConfigurator {
  private config: CloudFrontDistributionConfig | undefined;
  private valid = false;

  public constructor(config: CloudFrontDistributionConfig) {
    this.setConfig(config);
    this.validate();
  }

  /**
   * Get config
   * @returns {(Object | undefined)}
   */
  public getConfig(): CloudFrontDistributionConfig | undefined {
    return this.config;
  }

  /**
   * Set config
   * @returns {void}
   */
  private setConfig(config: CloudFrontDistributionConfig): void {
    this.config = config;
  }

  /**
   * Make config
   * @returns {CloudFrontDistributionConfig}
   */
  public static makeConfig(): CloudFrontDistributionConfig {
    const config = {
      CallerReference: '',
      Aliases: {
        Quantity: 0,
        Items: ['example.com']
      },
      DefaultRootObject: '',
      Origins: {
        Quantity: 2,
        Items: [
          {
            Id: 'example.us-east-1.elb.amazonaws.com',
            DomainName: 'example.us-east-1.elb.amazonaws.com',
            OriginPath: '',
            CustomHeaders: {
              Quantity: 1,
              Items: [
                {
                  HeaderName: 'CloudFront-Forwarded-Port',
                  HeaderValue: '443'
                }
              ]
            },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: 'http-only',
              OriginSslProtocols: {
                Quantity: 1,
                Items: ['TLSv1.2']
              },
              OriginReadTimeout: 30,
              OriginKeepaliveTimeout: 5
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false
            },
            OriginAccessControlId: ''
          },
          {
            Id: 'example.s3.me-south-1.amazonaws.com',
            DomainName: 'example.s3.me-south-1.amazonaws.com',
            OriginPath: '',
            CustomHeaders: {
              Quantity: 0
            },
            S3OriginConfig: {
              OriginAccessIdentity: 'origin-access-identity/cloudfront/exampleId'
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false
            },
            OriginAccessControlId: ''
          }
        ]
      },
      OriginGroups: {
        Quantity: 0
      },
      DefaultCacheBehavior: {
        TargetOriginId: 'example.s3.me-south-1.amazonaws.com',
        TrustedSigners: {
          Enabled: false,
          Quantity: 0
        },
        TrustedKeyGroups: {
          Enabled: false,
          Quantity: 0
        },
        ViewerProtocolPolicy: 'redirect-to-https',
        AllowedMethods: {
          Quantity: 2,
          Items: ['HEAD', 'GET'],
          CachedMethods: {
            Quantity: 2,
            Items: ['HEAD', 'GET']
          }
        },
        SmoothStreaming: false,
        Compress: true,
        LambdaFunctionAssociations: {
          Quantity: 0
        },
        FunctionAssociations: {
          Quantity: 0
        },
        FieldLevelEncryptionId: '',
        CachePolicyId: 'uuid',
        OriginRequestPolicyId: 'uuid'
      },
      CacheBehaviors: {
        Quantity: 1,
        Items: [
          {
            PathPattern: '/api*',
            TargetOriginId: 'example.us-east-1.elb.amazonaws.com',
            TrustedSigners: {
              Enabled: false,
              Quantity: 0
            },
            TrustedKeyGroups: {
              Enabled: false,
              Quantity: 0
            },
            ViewerProtocolPolicy: 'redirect-to-https',
            AllowedMethods: {
              Quantity: 7,
              Items: ['HEAD', 'DELETE', 'POST', 'GET', 'OPTIONS', 'PUT', 'PATCH'],
              CachedMethods: {
                Quantity: 2,
                Items: ['HEAD', 'GET']
              }
            },
            SmoothStreaming: false,
            Compress: true,
            LambdaFunctionAssociations: {
              Quantity: 0
            },
            FunctionAssociations: {
              Quantity: 0
            },
            FieldLevelEncryptionId: '',
            CachePolicyId: 'uuid',
            OriginRequestPolicyId: 'uuid'
          }
        ]
      },
      CustomErrorResponses: {
        Quantity: 0
      },
      Comment: '',
      Logging: {
        Enabled: false,
        IncludeCookies: false,
        Bucket: '',
        Prefix: ''
      },
      PriceClass: 'PriceClass_All',
      Enabled: true,
      ViewerCertificate: {
        CloudFrontDefaultCertificate: false,
        ACMCertificateArn: 'arn:aws:acm:us-east-1:accountId:certificate/certificateId',
        SSLSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2021',
        Certificate: 'arn:aws:acm:us-east-1:accountId:certificate/certificateId',
        CertificateSource: 'acm'
      },
      Restrictions: {
        GeoRestriction: {
          RestrictionType: 'none',
          Quantity: 0
        }
      },
      WebACLId: '',
      HttpVersion: 'http2and3',
      IsIPV6Enabled: false
    };

    return config;
  }

  /**
   * Set isValid
   * @param {boolean} valid - Whether or not the config is valid
   * @returns {void}
   */
  private setValid(valid: boolean): void {
    this.valid = valid;
  }

  /**
   * Is valid
   * @returns {boolean} - Whether or not the config is valid
   */
  public isValid(): boolean {
    return this.valid;
  }

  /**
   * Make Lambda Function association
   * @param {string} inputs.lambdaFunctionARN - The ARN of the Lambda Function
   * @param {string} inputs.eventType - The event type of the association
   * @param {boolean} inputs.includeBody - Whether or not to include the request body in the event object
   * @returns {Object}
   */
  public static makeLambdaFunctionAssociation(inputs: {
    lambdaFunctionARN: string;
    eventType: CloudFrontEventType;
    includeBody: boolean;
  }): CloudFrontLambdaFunctionAssociation {
    return {
      LambdaFunctionARN: inputs.lambdaFunctionARN,
      EventType: inputs.eventType,
      IncludeBody: inputs.includeBody
    };
  }

  /**
   * Make CloudFront Function association
   * @param {string} inputs.FunctionARN - The ARN of the CloudFront Function
   * @param {string} inputs.eventType - The event type of the association
   * @returns {Object}
   */
  public static makeCloudFrontFunctionAssociation(inputs: {
    functionARN: string;
    eventType: CloudFrontEventType;
  }): CloudFrontFunctionAssociation {
    return {
      FunctionARN: inputs.functionARN,
      EventType: inputs.eventType
    };
  }

  /**
   * Get Lambda Function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.eventType - The event type of the association
   * @returns {(Object | undefined)}
   */
  public getLambdaFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    eventType: CloudFrontEventType;
  }): CloudFrontLambdaFunctionAssociation | undefined {
    const { cacheBehaviorName, eventType } = inputs;

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const lambdaFunctions = this.getLambdaFunctionAssociations({ cacheBehavior });

    return lambdaFunctions?.filter((association) => association.EventType === eventType)[0];
  }

  /**
   * Get CloudFront Function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.eventType - The event type of the association
   * @returns {(Object[] | undefined)}
   */
  public getCloudFrontFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    eventType: CloudFrontEventType;
  }): CloudFrontFunctionAssociation | undefined {
    const { cacheBehaviorName, eventType } = inputs;

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const cloudFrontFunctions = this.getCloudFrontFunctionAssociations({ cacheBehavior });

    return cloudFrontFunctions?.filter((association) => association.EventType === eventType)[0];
  }

  /**
   * Get Lambda Function associations
   * @param {(Object | undefined)} inputs.cacheBehavior - The cache behavior
   * @returns {(Object[] | undefined)}
   */
  private getLambdaFunctionAssociations(inputs: {
    cacheBehavior: CloudFrontDefaultCacheBehavior | CloudFrontCacheBehavior | undefined;
  }): CloudFrontLambdaFunctionAssociation[] | undefined {
    const { cacheBehavior } = inputs;

    if (typeof cacheBehavior?.LambdaFunctionAssociations === 'undefined') {
      return;
    }

    let lambdaFunctionAssociations = cacheBehavior?.LambdaFunctionAssociations?.Items;
    if (!Array.isArray(lambdaFunctionAssociations)) {
      lambdaFunctionAssociations = cacheBehavior.LambdaFunctionAssociations.Items = [];
    }

    return lambdaFunctionAssociations;
  }

  /**
   * Get CloudFront Function associations
   * @param {(Object | undefined)} inputs.cacheBehavior - The cache behavior
   * @returns {(Object[] | undefined)}
   */
  private getCloudFrontFunctionAssociations(inputs: {
    cacheBehavior: CloudFrontDefaultCacheBehavior | CloudFrontCacheBehavior | undefined;
  }): CloudFrontFunctionAssociation[] | undefined {
    const { cacheBehavior } = inputs;

    if (typeof cacheBehavior?.FunctionAssociations === 'undefined') {
      return;
    }

    let cloudFrontFunctionAssociations = cacheBehavior.FunctionAssociations.Items;
    if (!Array.isArray(cloudFrontFunctionAssociations)) {
      cloudFrontFunctionAssociations = cacheBehavior.FunctionAssociations.Items = [];
    }

    return cloudFrontFunctionAssociations;
  }

  /**
   * Add Lambda Function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.lambdaFunctionARN - The ARN of the Lambda Function
   * @param {string} inputs.eventType - The event type of the association
   * @param {boolean} inputs.includeBody - Whether or not to include the request body in the event object
   */
  public addLambdaFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    lambdaFunctionARN: string;
    eventType: CloudFrontEventType;
    includeBody: boolean;
  }) {
    const { cacheBehaviorName, lambdaFunctionARN, eventType, includeBody } = inputs;

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const lambdaFunctionAssociations = this.getLambdaFunctionAssociations({ cacheBehavior });
    const newFunctionAssociation = CloudFrontDistributionConfigurator.makeLambdaFunctionAssociation({
      lambdaFunctionARN,
      eventType,
      includeBody
    });

    // function with matching event type will be replaced
    const replaceIndex = lambdaFunctionAssociations?.indexOf(
      lambdaFunctionAssociations.find(
        (association) => association.EventType === eventType
      ) as CloudFrontLambdaFunctionAssociation
    );

    if (typeof replaceIndex !== 'undefined' && replaceIndex >= 0) {
      // function with matching event type found, replace with new
      lambdaFunctionAssociations?.splice(replaceIndex, 1, newFunctionAssociation);
    } else {
      // no function with matching event type exists,
      // push to the associations array instead
      lambdaFunctionAssociations?.push(newFunctionAssociation);
    }

    // Lambda@Edge viewer events cannot be combined with CloudFront Function viewer events
    // Remove any CloudFront Function associations for this cache behavior
    // if (['viewer-request', 'viewer-response'].includes(eventType)) {
    //   this.removeCloudFrontFunctionAssociation({
    //     cacheBehaviorName,
    //     eventType: 'viewer-request'
    //   });
    //   this.removeCloudFrontFunctionAssociation({
    //     cacheBehaviorName,
    //     eventType: 'viewer-response'
    //   });
    // }

    this.processFunctionUpdate();
  }

  /**
   * Add CloudFront Function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.functionARN - The ARN of the CloudFront Function
   * @param {string} inputs.eventType - The event type of the association
   * @throws {Error} - Will throw if inputs.eventType does not meet condition
   * @returns {void}
   */
  public addCloudFrontFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    functionARN: string;
    eventType: CloudFrontEventType;
  }): void {
    const { cacheBehaviorName, functionARN, eventType } = inputs;

    if (!['viewer-request', 'viewer-response'].includes(eventType)) {
      throw new Error(
        `Allowed event types for CloudFront Functions include: [viewer-request, viewer-response]. Got: ${eventType}`
      );
    }

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const cloudFrontFunctionAssociations = this.getCloudFrontFunctionAssociations({ cacheBehavior });
    const newFunctionAssociation = CloudFrontDistributionConfigurator.makeCloudFrontFunctionAssociation({
      functionARN,
      eventType
    });

    // function with matching event type will be replaced
    const replaceIndex = cloudFrontFunctionAssociations?.indexOf(
      cloudFrontFunctionAssociations.find(
        (association) => association.EventType === eventType
      ) as CloudFrontFunctionAssociation
    );

    if (typeof replaceIndex !== 'undefined' && replaceIndex >= 0) {
      // function with matching event type found, replace with new
      cloudFrontFunctionAssociations?.splice(replaceIndex, 1, newFunctionAssociation);
    } else {
      // no function with matching event type exists,
      // push to the associations array instead
      cloudFrontFunctionAssociations?.push(newFunctionAssociation);
    }

    // Lambda@Edge viewer events cannot be combined with CloudFront Functions
    // Remove any Lambda@Edge viewer event associations for this cache behavior
    // if (['viewer-request', 'viewer-response'].includes(eventType)) {
    //   this.removeLambdaFunctionAssociation({
    //     cacheBehaviorName,
    //     eventType: 'viewer-request'
    //   });
    //   this.removeLambdaFunctionAssociation({
    //     cacheBehaviorName,
    //     eventType: 'viewer-response'
    //   });
    // }

    this.processFunctionUpdate();
  }

  /**
   * Remove Lambda function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.eventType - The event type of the association
   * @returns {void}
   */
  public removeLambdaFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    eventType: CloudFrontEventType;
  }): void {
    const { cacheBehaviorName, eventType } = inputs;

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const lambdaFunctions = this.getLambdaFunctionAssociations({ cacheBehavior });

    const deleteIndex = lambdaFunctions?.indexOf(
      lambdaFunctions.find((item) => item.EventType === eventType) as CloudFrontLambdaFunctionAssociation
    );

    if (typeof deleteIndex !== 'undefined' && deleteIndex >= 0) {
      lambdaFunctions?.splice(deleteIndex, 1);
    }

    this.processFunctionUpdate();
  }

  /**
   * Remove CloudFront Function association
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @param {string} inputs.eventType - The event type of the association
   * @returns {void}
   */
  public removeCloudFrontFunctionAssociation(inputs: {
    cacheBehaviorName: 'default' | string;
    eventType: CloudFrontEventType;
  }): void {
    const { cacheBehaviorName, eventType } = inputs;

    const cacheBehavior = this.getCacheBehavior({ cacheBehaviorName });
    const cloudFrontFunctions = this.getCloudFrontFunctionAssociations({ cacheBehavior });

    const deleteIndex = cloudFrontFunctions?.indexOf(
      cloudFrontFunctions.find((item) => item.EventType === eventType) as CloudFrontFunctionAssociation
    );

    if (typeof deleteIndex === 'number' && deleteIndex >= 0) {
      cloudFrontFunctions?.splice(deleteIndex, 1);
    }

    this.processFunctionUpdate();
  }

  /**
   * Get default cache behavior
   * @returns {(Object | undefined)} - The default cache behavior of the distribution
   */
  private getDefaultCacheBehavior(): CloudFrontDefaultCacheBehavior | undefined {
    return this.config?.DefaultCacheBehavior;
  }

  /**
   * Get cache behavior by path pattern
   * @param {string} pathPattern - The regex pattern identifying the cache behavior
   * @returns {(Object | undefined)} - The cache behavior
   */
  private getCacheBehaviorByPathPattern(pathPattern: string): CloudFrontCacheBehavior | undefined {
    return this.config?.CacheBehaviors?.Items?.filter((behavior) => behavior.PathPattern === pathPattern)[0];
  }

  /**
   * Get cache behavior
   * @param {string} inputs.cacheBehaviorName - The name of the cache behavior
   * @returns {(Object | undefined)}
   */
  private getCacheBehavior(inputs: {
    cacheBehaviorName: 'default' | string;
  }): CloudFrontDefaultCacheBehavior | CloudFrontCacheBehavior | undefined {
    const { cacheBehaviorName } = inputs;

    const cacheBehavior =
      cacheBehaviorName === 'default'
        ? this.getDefaultCacheBehavior()
        : this.getCacheBehaviorByPathPattern(cacheBehaviorName);

    return cacheBehavior;
  }

  /**
   * Get cache behaviors
   * @returns {Object[]}
   */
  private getCacheBehaviors(): Array<CloudFrontDefaultCacheBehavior | CloudFrontCacheBehavior> {
    const cacheBehaviors = [];
    const defaultCacheBehavior = this.config?.DefaultCacheBehavior;
    if (defaultCacheBehavior) {
      cacheBehaviors.push(defaultCacheBehavior);
    }
    const nonDefaultCacheBehaviors = this.config?.CacheBehaviors?.Items;
    if (Array.isArray(nonDefaultCacheBehaviors) && nonDefaultCacheBehaviors.length) {
      cacheBehaviors.push(...nonDefaultCacheBehaviors);
    }

    return cacheBehaviors;
  }

  /**
   * Reset function association quantities
   * @param {Object} inputs.cacheBehavior - The cache behavior
   * @returns {void}
   */
  private resetFunctionAssociationQuantities(inputs: {
    cacheBehavior: CloudFrontDefaultCacheBehavior | CloudFrontCacheBehavior;
  }): void {
    const { cacheBehavior } = inputs;

    // reset Lambda@Edge Function associations quantity
    const lambdaFunctionAssociations = cacheBehavior.LambdaFunctionAssociations;
    const lambdaFunctionAssociationItems = lambdaFunctionAssociations?.Items;
    if (lambdaFunctionAssociations && Array.isArray(lambdaFunctionAssociationItems)) {
      const numLambdaFunctionAssociations = lambdaFunctionAssociationItems.length;
      lambdaFunctionAssociations.Quantity = numLambdaFunctionAssociations;
    }

    // reset CloudFront Function associations quantity
    const cloudFrontFunctionAssociations = cacheBehavior.FunctionAssociations;
    const cloudFrontFunctionAssociationItems = cloudFrontFunctionAssociations?.Items;
    if (cloudFrontFunctionAssociations && Array.isArray(cloudFrontFunctionAssociationItems)) {
      const numCloudFrontFunctionAssociations = cloudFrontFunctionAssociationItems.length;
      cloudFrontFunctionAssociations.Quantity = numCloudFrontFunctionAssociations;
    }
  }

  /**
   * Process function update
   * @returns {void}
   */
  private processFunctionUpdate(): void {
    const cacheBehaviors = this.getCacheBehaviors();
    for (const cacheBehavior of cacheBehaviors) {
      this.resetFunctionAssociationQuantities({ cacheBehavior });
    }
  }

  /**
   * Validate
   * @throws {Error} - Will throw if various config conditions are not met
   * @returns {void}
   */
  public validate(): void {
    const cacheBehaviors = this.getCacheBehaviors();
    for (const behavior of cacheBehaviors) {
      const lambdaFunctions = behavior.LambdaFunctionAssociations;
      const cloudFrontFunctions = behavior.FunctionAssociations;

      // "Quantity" property of function associations must be equal to actual
      // quantity of corresponding function associations
      if (Array.isArray(lambdaFunctions?.Items) && lambdaFunctions?.Quantity !== lambdaFunctions?.Items?.length) {
        this.setValid(false);
        throw new CloudFrontDistributionConfigValidationError(
          'Lambda functions "Quantity" property not equal to actual quantity.'
        );
      }
      if (
        Array.isArray(cloudFrontFunctions?.Items) &&
        cloudFrontFunctions?.Quantity !== cloudFrontFunctions?.Items?.length
      ) {
        this.setValid(false);
        throw new CloudFrontDistributionConfigValidationError(
          'CloudFront functions "Quantity" property not equal to actual quantity.'
        );
      }

      // If there is a CloudFront Function association of a viewer event type,
      // there cannot be a Lambda@Edge association of a viewer event type
      const hasLambdaFunctionViewerEvent = Boolean(
        lambdaFunctions?.Items?.filter((association) =>
          ['viewer-request', 'viewer-response'].includes(association.EventType as CloudFrontEventType)
        ).length
      );
      const hasCloudFrontFunctionViewerEvent = Boolean(
        cloudFrontFunctions?.Items?.filter((association) =>
          ['viewer-request', 'viewer-response'].includes(association.EventType as CloudFrontEventType)
        ).length
      );
      if (hasLambdaFunctionViewerEvent && hasCloudFrontFunctionViewerEvent) {
        this.setValid(false);
        throw new CloudFrontDistributionConfigValidationError(
          'CloudFront Function viewer events cannot be combined with Lambda@Edge viewer events.'
        );
      }
    }

    this.setValid(true);
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getCloudFrontDistributionConfig, updateCloudFrontDistribution } from './lib';
// import config from './cf-config.json';

(async () => {
  const { DistributionConfig: config } = await getCloudFrontDistributionConfig('E2ZMSV71F73L5X');
  await updateCloudFrontDistribution('E2ZMSV71F73L5X', config!);
})();

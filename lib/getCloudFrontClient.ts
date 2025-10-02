import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

type Clients = {
  [key: string]: CloudFrontClient;
};

const clients: Clients = {};

export function getCloudFrontClient(region: string): CloudFrontClient {
  if (clients[region]) return clients[region];
  clients[region] = new CloudFrontClient({ region });
  return clients[region];
}

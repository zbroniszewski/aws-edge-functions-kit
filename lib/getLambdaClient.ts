import { LambdaClient } from '@aws-sdk/client-lambda';

type Clients = {
  [key: string]: LambdaClient;
};

const clients: Clients = {};

export const getLambdaClient = (region: string) => {
  if (clients[region]) return clients[region];
  clients[region] = new LambdaClient({ region });
  return clients[region];
};

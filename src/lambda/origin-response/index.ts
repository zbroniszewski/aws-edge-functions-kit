import { CloudFrontResponseHandler } from 'aws-lambda';

export const handler: CloudFrontResponseHandler = (event, _context, callback) => {
  // Extract the origin request / response
  const { response } = event.Records[0].cf;

  // Unauthorized - this will occur when a page is not found via the S3 REST API
  if (response.status !== '403') {
    return callback(null, response);
  }

  // prepare redirect to 404 page
  const { request } = event.Records[0].cf;
  // origin request path (transformed in origin request function)
  const requestPath = request.uri;
  // original viewer request path
  let originalRequestPath = requestPath;
  // remove /index.html from end of path
  if (requestPath.endsWith('/index.html') && requestPath !== '/index.html') {
    originalRequestPath = requestPath.slice(0, -String('/index.html').length);
  }
  response.status = '302';
  response.headers['location'] = [
    {
      key: 'Location',
      value: `/404?uriNotFound=${encodeURIComponent(originalRequestPath)}`
    }
  ];

  return callback(null, { ...response, body: '' });
};

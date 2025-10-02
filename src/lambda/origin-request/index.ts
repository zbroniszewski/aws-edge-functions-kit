import { Callback, CloudFrontRequest, CloudFrontRequestHandler, CloudFrontRequestResult } from 'aws-lambda';

export const handler: CloudFrontRequestHandler = (event, _context, callback) => {
  try {
    // Extract the request from the CloudFront event that is sent to Lambda@Edge
    const { request } = event.Records[0].cf;

    /**
     * Redirect trailing-slash to non trailing-slash
     */
    const lastCharacterInUri = request.uri.slice(-1);
    if (request.uri !== '/' && lastCharacterInUri === '/') {
      const redirect = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          location: [
            {
              key: 'Location',
              value: request.uri.slice(0, -1)
            }
          ]
        }
      };

      return callback(null, redirect);
    }

    /**
     * Check if `index.html` should be appended to request path
     */

    if (request.uri.includes('.')) {
      // Redirect if HTML files are being directly accessed
      const directAccessSuffix = '/index.html';
      if (request.uri.endsWith(directAccessSuffix)) {
        const redirect = {
          status: '301',
          statusDescription: 'Moved Permanently',
          headers: {
            location: [
              {
                key: 'Location',
                value: request.uri.slice(0, -directAccessSuffix.length)
              }
            ]
          }
        };
        return callback(null, redirect);
      }

      // Request is a granted file, do not modify
      return nextWithRequest(null, request, callback);
    }

    // Append `/index.html` to request path
    let newUri = request.uri;
    if (request.uri !== '/') {
      newUri += '/';
    }
    newUri += 'index.html';

    // Replace the received URI with the URI that includes the index page
    request.uri = newUri;

    // Request to Origin
    return nextWithRequest(null, request, callback);
  } catch (err) {
    console.error(err);
  }
};

function nextWithRequest(err: Error | null, request: CloudFrontRequest, callback: Callback<CloudFrontRequestResult>) {
  return callback(err, request);
}

import { CloudFrontFunctionsEvent } from 'aws-lambda';
import { redirects } from '../../resources/redirects';

export default function handler(event: CloudFrontFunctionsEvent) {
  const request = event.request;
  const uri = request.uri;
  const now = Date.now();

  for (const { type, from, to, temporary, expires } of redirects) {
    if (type === 'exact') {
      if (uri === from && expires !== false && expires > now) {
        return {
          statusCode: temporary ? 302 : 301,
          statusDescription: temporary ? 'Found' : 'Moved Permanently',
          headers: {
            location: {
              value: to
            }
          }
        };
      }
    } else if (type === 'regex') {
      if ((from as RegExp).test(uri) && expires !== false && expires > now) {
        return {
          statusCode: temporary ? 302 : 301,
          statusDescription: temporary ? 'Found' : 'Moved Permanently',
          headers: {
            location: {
              value: to
            }
          }
        };
      }
    }
  }

  return request;
}

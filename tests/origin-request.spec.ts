import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResultResponse, Context } from 'aws-lambda';
import { originRequestEvent } from './events';
import { handler as originRequestHandler } from '../src/lambda/origin-request';

describe('Origin Request Function', () => {
  test('The Origin Request function should append /index.html to request URI when original URI is /', (done) => {
    // Given: An Origin Request event
    const eventUnderTest: CloudFrontRequestEvent = JSON.parse(JSON.stringify(originRequestEvent));
    eventUnderTest.Records[0].cf.request.uri = '/';

    // When: The Origin Request function is invoked
    originRequestHandler(eventUnderTest, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return the same request object, with /index.html appended to request URI
        expect((result as CloudFrontRequest).uri).toBe('/index.html');
        done();
      } catch (error) {
        done(error);
      }
    }
  });

  test('The Origin Request function should append /index.html to request URI when original URI is /test', (done) => {
    // Given: An Origin Request event
    const eventUnderTest: CloudFrontRequestEvent = JSON.parse(JSON.stringify(originRequestEvent));
    eventUnderTest.Records[0].cf.request.uri = '/test';

    // When: The Origin Request function is invoked
    originRequestHandler(eventUnderTest, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return the same request object, with /index.html appended to request URI
        expect((result as CloudFrontRequest).uri).toBe('/test/index.html');
        done();
      } catch (error) {
        done(error);
      }
    }
  });

  test('The Origin Request function should redirect trailing-slash to non-trailing-slash', (done) => {
    // Given: An Origin Request event with a trailing-slash URI
    const eventUnderTest: CloudFrontRequestEvent = JSON.parse(JSON.stringify(originRequestEvent));
    eventUnderTest.Records[0].cf.request.uri = '/trailing-slash/';

    // When: The Origin Request function is invoked
    originRequestHandler(eventUnderTest as CloudFrontRequestEvent, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return a 301 response status
        expect((result as CloudFrontResultResponse)?.status).toBe('301');
        // Then: The function should return a "Location" header without the trailing-slash
        expect(result?.headers?.location?.[0]?.value).toBe('/trailing-slash');
        done();
      } catch (error) {
        done(error);
      }
    }
  });

  test('The Origin Request function should not modify URIs with file extensions', (done) => {
    // Given: An Origin Request event containing a URI with a file extension
    const eventUnderTest: CloudFrontRequestEvent = JSON.parse(JSON.stringify(originRequestEvent));
    eventUnderTest.Records[0].cf.request.uri = '/test.js';

    // When: The Origin Request function is invoked
    originRequestHandler(eventUnderTest as CloudFrontRequestEvent, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return the same URI
        expect((result as CloudFrontRequest)?.uri).toBe('/test.js');
        done();
      } catch (error) {
        done(error);
      }
    }
  });
});

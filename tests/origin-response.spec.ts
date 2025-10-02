import { CloudFrontResponseEvent, CloudFrontResultResponse, Context } from 'aws-lambda';
import { originResponseEvent } from './events';
import { handler as originResponseHandler } from '../src/lambda/origin-response';

describe('Origin Response Function', () => {
  test('The Origin Response function should return a 200 status if the Origin returns a 200 status', (done) => {
    // Given: An Origin Response event
    const eventUnderTest: CloudFrontResponseEvent = JSON.parse(JSON.stringify(originResponseEvent));
    eventUnderTest.Records[0].cf.response.status = '200';

    // When: The Origin Response function is invoked
    originResponseHandler(eventUnderTest, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return a 200 response status
        expect((result as CloudFrontResultResponse)?.status).toBe('200');
        done();
      } catch (error) {
        done(error);
      }
    }
  });

  test('The Origin Response function should redirect to the /404 page if the Origin returns a 403 response status', (done) => {
    // Given: An Origin Response event
    const eventUnderTest: CloudFrontResponseEvent = JSON.parse(JSON.stringify(originResponseEvent));
    eventUnderTest.Records[0].cf.response.status = '403';

    // When: The Origin Response function is invoked
    originResponseHandler(eventUnderTest, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return a 302 response status
        expect((result as CloudFrontResultResponse)?.status).toBe('302');
        // Then: The function should return a "Location" header without the trailing-slash
        expect(result?.headers?.location?.[0]?.value).toMatch(/^\/404(\?uriNotFound=[a-zA-Z0-9-_.!~*'()%]*)?$/);
        done();
      } catch (error) {
        done(error);
      }
    }
  });

  test('The Origin Response function should add the "Not Found" path to a query param when redirecting to the /404 page', (done) => {
    // Given: An Origin Response event
    const eventUnderTest: CloudFrontResponseEvent = JSON.parse(JSON.stringify(originResponseEvent));
    eventUnderTest.Records[0].cf.request.uri = '/path/not/found/index.html';
    eventUnderTest.Records[0].cf.response.status = '403';

    // When: The Origin Response function is invoked
    originResponseHandler(eventUnderTest, {} as Context, callback);

    function callback(error: any, result: any) {
      if (error) {
        done(error);
        return;
      }
      try {
        // Then: The function should return a 302 response status
        expect((result as CloudFrontResultResponse)?.status).toBe('302');
        // Then: The function should return a "Location" header without the trailing-slash
        expect(result?.headers?.location?.[0]?.value).toBe(`/404?uriNotFound=${encodeURIComponent('/path/not/found')}`);
        done();
      } catch (error) {
        done(error);
      }
    }
  });
});

import viewerRequestHandler from '../src/cloudfront/viewer-request';

describe('Viewer Request Function', () => {
  test('The Viewer Request function should redirect an "exact" match', () => {
    // Given: A URI within the redirects list
    const event = {
      request: {
        method: 'GET',
        uri: '/example'
      }
    };

    // When: The Viewer Request function is invoked
    const result = viewerRequestHandler(event as any);

    // Then: The response status code should be 302
    expect((result as any).statusCode).toBe(302);
    // Then: The "Location" response header should be "/our-services"
    expect(result.headers.location.value).toBe('/our-services');
  });

  test('The Viewer Request function should redirect a "regex" match', () => {
    // Given: A URI within the redirects list
    const event = {
      request: {
        method: 'GET',
        uri: '/hello'
      }
    };

    // When: The Viewer Request function is invoked
    const result = viewerRequestHandler(event as any);

    // Then: The response status code should be 302
    expect((result as any).statusCode).toBe(302);
    // Then: The "Location" response header should be "/our-services"
    expect(result.headers.location.value).toBe('/about');
  });

  test('The Viewer Request function should return the request when no redirect is matched.', () => {
    // Given: A URI within the redirects list
    const event = {
      request: {
        method: 'GET',
        uri: '/'
      }
    };

    // When: The Viewer Request function is invoked
    const result = viewerRequestHandler(event as any);

    // Then: The result should match the request
    expect(result).toBe(event.request);
  });
});

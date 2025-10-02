# AWS Edge Functions Kit

Development, testing and deployment of Lambda@Edge and CloudFront functions.

## Table of Contents

<!--toc:start-->

- [Background](#background)
- [Getting Started](#getting-started)
- [CloudFront User Config](#cloudfront-user-config)

<!--toc:end-->

## Background

Amazon CloudFront (CDN) supports two methods of executing server-side code during different stages of a request:

- Lambda@Edge
- CloudFront functions

It's important to know and understand the stages of a CloudFront request. They are:

- Viewer Request
- Origin Request
- Origin Response
- Viewer Response

Each stage supports a single edge function association, whether Lambda@Edge or a CloudFront function.  
It is imperative to test these edge functions prior to associating them with your CloudFront distribution.  
There are no out-of-the-box, robust strategies that exist today to accomplish this due to the complexity
and integration of services that comprise CloudFront.  
AWS reccommends ["complete integration testing, where your function is associated with a distribution
and runs based on a CloudFront event."](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-testing-debugging.html#lambda-edge-testing-debugging-test-function)  
This makes sense, but is difficult to achieve. At this time, we are unit testing our functions,
using CloudFront request/response event objects.

## Getting Started

This project uses docker-compose.

1. docker-compose up -d --build
2. docker-compose exec builder sh
3. npm run build
4. npm run test

## CloudFront User Config

The CloudFront user config is located at `./config/cloudfront.yaml` in the project.

The CloudFront user config uses the following structure:

```yaml
distributionId:
  - behavior: { '*', '/api*' }
    lambdaAssociations:
      - functionName: lambda-function-name
        eventType: { viewer-request, viewer-response, origin-request, origin-response }
        filePath: path/to/function/code
        includeBody: { true, false }
    functionAssociations:
      - functionName: cloudfront-function-name
        eventType: { viewer-request, viewer-response }
        filePath: path/to/function/code
```

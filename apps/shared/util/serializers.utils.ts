import { Request, Response } from 'express';

export function serializeRequest(req: Request) {
  const connection = req.socket;
  const request = {};
  request['id'] = req['id'];
  request['method'] = req.method;

  if (req.originalUrl) {
    request['url'] = req.originalUrl;
  }

  if (req.query) {
    request['query'] = req.query;
  }

  if (req.params) {
    request['params'] = req.params;
  }

  request['headers'] = req.headers;
  request['remoteAddress'] = connection?.remoteAddress;
  request['remotePort'] = connection?.remotePort;

  if (req.body) {
    request['body'] = req.body;
  }

  return request;
}

export function serializeResponse(res: Response) {
  const response = {};
  response['statusCode'] = res.statusCode;
  response['headers'] = res.getHeaders ? res.getHeaders() : res['_headers'];
  return response;
}

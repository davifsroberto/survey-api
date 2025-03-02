import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body };
    const httpResponse = await controller.handle(httpRequest);
    const { statusCode, body } = httpResponse;
    const error = { error: body.message };

    if (statusCode !== 200) {
      res.status(statusCode).json(error);

      return;
    }

    return res.status(statusCode).json(body);
  };
};

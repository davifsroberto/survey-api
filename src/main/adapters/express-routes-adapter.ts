import { Request, Response } from 'express';

import { Controller, HttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body };
    const { statusCode, body } = await controller.handle(httpRequest);

    if (statusCode === 200) {
      res.status(statusCode).json(body);

      return;
    }

    res.status(statusCode).json({ error: String(body.message) });
  };
};

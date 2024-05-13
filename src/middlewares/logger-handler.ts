import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import onHeaders from "on-headers";

function loggerMiddleware(req: Request, res: Response, _next: NextFunction) {
  logger.debug("request received: ", {
    URL: req.url,
    METHOD: req.method,
    STATUSCODE: res.statusCode

  });

//   GET method
  onHeaders(res, () => {
    logger.info("response sent", {
      URL: req.url,
      METHOD: req.method,
      STATUSCODE: res.statusCode,
    });
  });

  _next();
}

export default loggerMiddleware;

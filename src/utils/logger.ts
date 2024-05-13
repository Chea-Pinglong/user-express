import winston from "winston";
import path from "path";

// Create a Winston Logger
export const logger = winston.createLogger({
  defaultMeta: { SERVICE: "auth" },
  // Add a timestamp to each log message & format in JSON
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()),
  transports: [],
});

export const logInit = ({
  env,
  logLevel,
}: {
  env: string | undefined;
  logLevel: string | undefined;
}) => {
  // Output Logs to the Console (Unless it's Testing)
  logger.add(
    new winston.transports.Console({
      LEVEL: logLevel,
      silent: env === "testing",
    })
  );

  if (env !== "development") {
    logger.add(
      new winston.transports.File({
        LEVEL: logLevel,
        filename: path.join(__dirname, "../../logs/auth-service.log"),
      })
    );
  }
};

export const logDestroy = () => {
  logger.clear();
  logger.close();
};

import pino from "pino";

const logger = pino({
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
  formatters: {
    level(label: string) {
      return { severity: label.toUpperCase() };
    },
  },
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
});
export default logger;

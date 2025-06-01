const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Definisikan format log untuk file (JSON)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Definisikan format log untuk konsol (teks berwarna)
const consoleLogFormat = winston.format.combine(
  winston.format.colorize(), // Menambahkan warna ke level log
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Tambahkan timestamp
  winston.format.printf(
    // Pastikan info.level dan info.message selalu ada
    (info) => {
      // Menangani kasus di mana info.level atau info.message mungkin undefined
      const level = info.level !== undefined ? info.level : "unknown";
      const message =
        info.message !== undefined ? info.message : "No message provided";
      const stack = info.stack ? `\n${info.stack}` : "";
      return `${info.timestamp} ${level}: ${message}${stack}`;
    }
  )
);

// Transport untuk log di konsol
const consoleTransport = new winston.transports.Console({
  level: "info", // Level minimum untuk konsol
  format: consoleLogFormat, // Gunakan format konsol yang baru
});

// Transport untuk log ke file aplikasi
const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: fileLogFormat, // Gunakan format JSON untuk file
});

// Transport untuk log ke file error
const errorFileRotateTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "7d",
  level: "error",
  format: fileLogFormat, // Gunakan format JSON untuk file
});

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [consoleTransport, fileRotateTransport, errorFileRotateTransport],
  exitOnError: false,
});

module.exports = logger;

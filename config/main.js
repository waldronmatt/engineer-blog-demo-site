/* eslint-disable unicorn/prevent-abbreviations */
const path = require('node:path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const rateLimit = require('express-rate-limit');
// const cors = require('cors');
// const helmet = require('helmet');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const rootRouter = require('./routes');

// eslint-disable-next-line import/prefer-default-export
export const expressApp = () => {
  const app = express();

  app.disable('x-powered-by');
  // app.use(cors());
  // app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 100, // 1 minute
      max: 200,
    })
  );

  // @PERFORMANCE-COMMENT
  // compress assets for better perf
  //
  // better performance to serve assets statically from webpack
  // than to have express do this 'on-the-fly' (dynamically)
  //
  // brotli chosen for better speed and good compression
  app.use(
    '/',
    expressStaticGzip(path.join(__dirname), {
      enableBrotli: true,
    })
  );

  app.use(
    logger((tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    })
  );

  app.use('/', rootRouter);

  return app;
};

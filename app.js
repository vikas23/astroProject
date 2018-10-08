const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
// const db = require('./config/db');
const router = require('./server/routes');
const logger = require('./config/winston');

// Make global variables
global.config = config;
global.logger = logger;

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.use('', router);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    // add this line to include winston logging
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // render the error page
    res.status(err.status || 500).send({
      message: err.message,
      error: err,
    });
  }
  next();
});

app.listen(config.PORT, '127.0.0.1', () => {
  logger.info(`Server running at port: ${config.PORT}`);
});
// DB connection can be enabled from here

// db.connect(config.MONGOURL, (err) => {
//   if (err) {
//     logger.error(`mongodb connection failed !!! ${err.stack}`);
//     process.exit(1);
//   } else {
//     logger.info('MongoDB connected.');
//     // require("./db_services/db_init")('testing');
//     app.listen(config.PORT, '127.0.0.1', () => {
//       logger.info(`Server running in ${process.env.NODE_ENV} mode at port: ${config.PORT}`);
//     });
//   }
// });

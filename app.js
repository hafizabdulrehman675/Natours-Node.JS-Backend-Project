const express = require('express');

const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// this is use as a middleware that send our request to the server in javascript data format otherwise this will be undefined on console.log(req.body) in post request

// (1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // console.log(process.env.NODE_ENV);
}
app.use(express.json());
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't fine ${req.originalUrl} from this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} from this server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} from this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;

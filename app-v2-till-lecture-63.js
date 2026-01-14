const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const port = 3000;
// this is use as a middleware that send our request to the server in javascript data format otherwise this will be undefined on console.log(req.body) in post request

// (1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// (2) ROUTEHANDLERS
// Get tours Request
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};
// Get One Tour Request based on id
const getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
// Post Tour Request
const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
  // res.send('Done');
};
// Update tour by patch request
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  res.status(200).json({
    status: 'success',

    data: {
      tour: '<tour Successfully updated>',
    },
  });
};
// Delete Tour
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not created yed',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not created yed',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not created yed',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not created yed',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not created yed',
  });
};
// (3) ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.post('/api/v1/tours', createTour);

// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
//   .route('/api/v1/userss/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// (4) SERVER
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
// const tourRouter = express.Router();
// const userRouter = express.Router();
// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// // (4) SERVER
// app.listen(port, () => {
//   console.log(`app running on port ${port}`);
// });

//code Till lecture 50

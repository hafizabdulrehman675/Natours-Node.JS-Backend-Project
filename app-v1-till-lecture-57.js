const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// this is use as a middleware that send our request to the server in javascript data format otherwise this will be undefined on console.log(req.body) in post request
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the server');
// });
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello From the server', app: 'natours' });
// });
// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// Get tours Request
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});
// Get One Tour Request based on id
app.get('/api/v1/tours/:id', (req, res) => {
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
});
// Update tour by patch request
app.patch('/api/v1/tours/:id', (req, res) => {
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
});
// Delete Tour
app.delete('/api/v1/tours/:id', (req, res) => {
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
});
// Post Tour Request
app.post('/api/v1/tours', (req, res) => {
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
});
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

//code Till lecture 50

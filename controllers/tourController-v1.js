const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
exports.checkID = (req, res, next, val) => {
  console.log(`tour id is ${val}`);
  if (!val) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing tour name and price',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};
// Get One Tour Request based on id
exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
// Post Tour Request
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    },
  );
  // res.send('Done');
};
// Update tour by patch request
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',

    data: {
      tour: '<tour Successfully updated>',
    },
  });
};
// Delete Tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const { match } = require('assert');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log('Hello from the aliasTopTours middleware');

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Building Query

    // Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // // console.log(req.query, queryObj);
    // // Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // console.log(JSON.parse(queryStr));
    // // { limit: '10', duration: { gte: '5' } } { duration: { $gte: '5' } }
    // // { limit: '10', duration: { gte: '5' } } { duration: { gte: '5' } }
    // let query = Tour.find(JSON.parse(queryStr));
    // // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }
    // // 3) Feilds limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else query = query.select('-__v');
    // // 4) pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numCounts = await Tour.countDocuments();
    //   if (skip >= numCounts) throw new Error('This page does not exist');
    // }
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter();

    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// Get One Tour Request based on id
exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  try {
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// Post Tour Request
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log(newTour);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'fail', message: err });
  }
  // res.send('Done');
};
// Update tour by patch request
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
// Delete Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, req.body);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          // _id: null,
          _id: { $toUpper: '$difficulty' },
          // _id: '$difficulty',
          // _id: '$ratingsAverage',

          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'EASY' } } },
    ]);
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

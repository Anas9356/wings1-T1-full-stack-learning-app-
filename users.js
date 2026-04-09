const express = require("express");
const Course = require("../mongoose/models/courses");

const usersRouter = new express.Router();

// ✅ GET ALL COURSES
usersRouter.get("/courses/get", async (req, res) => {
  const courses = await Course.find();
  res.status(200).send(courses);
});

// ✅ ENROLL
usersRouter.post("/courses/enroll/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course.isApplied) {
    course.isApplied = true;
    await course.save();
    return res.status(200).send({ message: "Successfully enrolled" });
  }

  res.status(403).send();
});

// ✅ DROP
usersRouter.delete("/courses/drop/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course.isApplied) {
    course.isApplied = false;
    await course.save();
    return res.status(200).send();
  }

  res.status(403).send();
});

// ✅ RATING
usersRouter.patch("/courses/rating/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  // must be applied AND not rated
  if (!course.isRated && course.isApplied) {
    const newRating = req.body.rating;

    const total =
      course.rating * course.noOfRatings + newRating;

    course.noOfRatings += 1;
    course.rating = parseFloat(
      (total / course.noOfRatings).toFixed(1)
    );

    course.isRated = true;

    await course.save();

    return res.status(200).send();
  }

  res.status(403).send();
});

module.exports = usersRouter;
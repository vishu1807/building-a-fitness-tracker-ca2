
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.json());


mongoose.connect('mongodb+srv://vishubgmi18:viratkh18@asap.4phjq.mongodb.net/}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));


const workoutSchema = new mongoose.Schema({
  user: { type: String, required: [true, "user is required"] },
  date: { type: Date, required: [true, "date is required"] },
  duration: { type: Number, required: [true, "duration is required"] },
  caloriesBurned: { type: Number },
  exercises: [
    {
      name: { type: String, required: [true, "exercise name is required"] },
      repetitions: { type: Number },
      sets: { type: Number },
      weight: { type: Number },
    },
  ],
});

const Workout = mongoose.model("Workout", workoutSchema);


app.post("/workouts", async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: `Validation failed: ${error.message}` });
  }
});


app.get("/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get("/workouts/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.put("/workouts/:id", async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedWorkout) return res.status(404).json({ error: "Workout not found" });
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ error: `Validation failed: ${error.message}` });
  }
});


app.delete("/workouts/:id", async (req, res) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
    if (!deletedWorkout) return res.status(404).json({ error: "Workout not found" });
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


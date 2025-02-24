const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessDB';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const WorkoutSchema = new mongoose.Schema({
    user: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number },
    exercises: [{
        name: { type: String, required: true },
        reps: { type: Number },
        sets: { type: Number },
        weight: { type: Number }
    }]
});
const Workout = mongoose.model('Workout', WorkoutSchema);

// Routes
app.post('/workouts', async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).json({ message: 'Workout logged successfully', data: workout });
    } catch (err) {
        res.status(400).json({ error: `Validation failed: ${err.message}` });
    }
});

app.get('/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json({ message: workouts.length ? 'Workouts retrieved successfully' : 'No workouts available.', data: workouts });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.json({ message: 'Workout found', data: workout });
    } catch (err) {
        res.status(400).json({ error: 'Invalid workout ID' });
    }
});

app.put('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.json({ message: 'Workout updated successfully', data: workout });
    } catch (err) {
        res.status(400).json({ error: `Validation failed: ${err.message}` });
    }
});

app.delete('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.json({ message: 'Workout deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid workout ID' });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const analyzeRoute = require('./routes/analyzeRoute');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/analyze', analyzeRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

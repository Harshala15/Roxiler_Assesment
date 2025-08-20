const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('.//routes/users');
const storeRoutes = require('./routes/store');
const ratingRoutes = require('./routes/rating');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

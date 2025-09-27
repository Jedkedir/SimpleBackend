const express = require('express')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/userMangRoutes'));
app.use('/api/dash', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
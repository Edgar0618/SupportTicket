const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const app = express();

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Support Desk API'})
});

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });

const express = require('express');
const mongoose = require('mongoose');
const dataRouter = require('./dataRouter');

const app = express();
const port = 3000;

const uri = 'mongodb://127.0.0.1:27017/kbo_back';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.log(err)
    console.log(uri)
  });

app.use('/data', dataRouter);
app.use('/api/users', require('./routes/userRoutes'));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const express = require('express');
const uploadRouter = require('./router');
const app = express();
 
app.get('/', (_, res) => {
  res.sendFile("Hello from Server");
});
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadRouter);
 
app.listen(5000, () => {
  console.log('Form running on port 5000');
});
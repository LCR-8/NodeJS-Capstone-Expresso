const express = require('express');
const app = express();

app.use(express.static('public'));

module.exports = app;

const cors = require('cors');
app.use(cors());

const morgan = require ('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const errorhandler = require('errorhandler');
app.use(errorhandler());

const PORT = process.env.PORT || 4000;

const apiRouter = require('./api/api');

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log('Unhandled exception: ', err);
  res.status(500).send(err);
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log('Server is listening on port', PORT);
  });
}

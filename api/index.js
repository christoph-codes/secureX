const express = require('express');
const routes = require('./routes/routes');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config({path: './.env'});

const app = express();

const port = process.env.PORT || 8000;

//Middleware
app.use(bodyParser.json());

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

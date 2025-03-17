const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRoute')
const webRouter = require('./routes/webRoute')
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', userRouter);
app.use('/', webRouter);

require('./config/db')

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "ERROR";
    res.status(err.statusCode).json({
        message: err.message,
    })
})




app.listen(5001, () => {
    console.log("My Server");
})
const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const invoiceRouter = require('./routes/invoiceRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require('morgan');
dbConnect();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Change this to your client's origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }));
  
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user',authRouter);
app.use('/api/invoice', invoiceRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});
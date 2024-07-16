
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const chalk = require('chalk')


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/cards', require('./routes/cardsRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/auth' , require('./routes/authRoutes'));


const { PORT } = process.env;
console.log(chalk.blue('You are using Chalk'));

connectDB().then(()=>{
  app.listen(PORT, ()=> console.log(`Server is listening for requests on http://127.0.0.1:${PORT}`))
});
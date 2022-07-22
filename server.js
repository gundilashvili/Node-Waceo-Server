const express = require('express');
const mongoose = require('mongoose');
const initialize = require("./controllers/index");
 
const app = express(); 
const cors = require('cors');
require("dotenv").config();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
 
 
// connect to database
mongoose
    .connect(process.env.mongoURI)
    .then(() => {  
      console.log('Connected to mongoDB ...');  
      initialize();
    } )
    .catch(err => console.log(err)); 

// parser middleware
app.use(express.json({ extended: false, limit: '100mb'}));
app.use(cors({origin: true, credentials: true})); 
 

// Define Routes
app.use('/api/waceo/prices',  require('./routes/api/prices'));    
app.use('/api/waceo/funds',  require('./routes/api/funds'));    
app.use('/api/waceo/transactions',  require('./routes/api/transactions'));    
app.use('/api/waceo/treasury',  require('./routes/api/treasury'));    

// listening server on dev port
const PORT = process.env.PORT || 5000;  
 

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`); 
})
 
 
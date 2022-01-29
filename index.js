require('dotenv').config();
const express = require('express');
const app = express();
var cors = require('cors')
const addressesRoutes = require('./routes/addresses');

var corsMiddleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); 
    next();
}


//If you got your own .env file, please provide it or use the default port 3001.
const PORT = process.env.PORT || 3001;
app.use(corsMiddleware);

app.use('/addresses/', addressesRoutes);

app.listen(PORT, ()=>{
    console.log("Server start for port: " + PORT)
})
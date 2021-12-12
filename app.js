const express = require('express');
const bodyParser = require('body-parser');
const api = require('./src/api');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const db = process.env.DB_URL;
dotenv.config();

mongoose.connect(db, { useNewUrlParser : true, 
    useUnifiedTopology: true }, function(error) {
        if (error) {
            console.log("Error!" + error);
        }
    });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', api);
app.use('/', (_, res) => {
    res.status(200).send("App is running")
});

app.listen(port, function() {
	console.log("Server is listening at port:" + port);
});
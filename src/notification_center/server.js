const express = require('express');
const busboy = require('connect-busboy'); 
const path = require('path');     
const fs = require('fs-extra');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.raw({defer: true}));
app.use(cors());

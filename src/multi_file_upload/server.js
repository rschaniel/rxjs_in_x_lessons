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

app.route('/upload')
    .post(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Headers', '*');
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, fileDataObject) {
            console.log("Uploading: " + fileDataObject.filename);
            if (fileDataObject.filename === 'Screenshot 2025-09-14 at 20.38.03.png') {
                res.sendStatus(500);
                return;
            }

            fstream = fs.createWriteStream(__dirname + '/files/' + fileDataObject.filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + fileDataObject.filename);     
                res.send('Successfully uploaded');
            });
        });
    }
);

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});
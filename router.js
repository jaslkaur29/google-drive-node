const fs = require('fs')
const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const request = require("request");
const uploadRouter = express.Router();
const upload = multer();
const http = require('http');

const GOOGLE_API_FOLDER_ID = "1Va5Cmz6xjmqTJpt_rCdjYwaEM7Lr9K2G";

const KEYFILEPATH = path.join(__dirname, "googlekey.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
 
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: [GOOGLE_API_FOLDER_ID],
      },
      fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
  };

uploadRouter.post("/upload", upload.any(), async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { body, files } = req;
  
      for (let f = 0; f < files.length; f += 1) {
        await uploadFile(files[f]);
      }
  
      console.log(body);
      res.status(200).send("Form Submitted");
    } catch (f) {
      res.send(f.message);
    }
  });

  let driveFiles = []
  function processList(files) {
    console.log('Processing....');
    files.forEach(file => {
        //console.log(file.name + '|' + file.size + '|' + file.createdTime + '|' + file.modifiedTime);
        driveFiles.push(file)
    });
}

  function getList(drive, pageToken) {
    console.log("inside getList")
    drive.files.list({
        corpora: 'user',
        pageToken: pageToken ? pageToken : '',
        fields: 'nextPageToken, files(*)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            processList(files);
            if (res.data.nextPageToken) {
                getList(drive, res.data.nextPageToken);
            }
        } else {
            console.log('No files found.');
        }
    });
}

  uploadRouter.get("/getFiles", async (req,res) => {
    driveFiles = []
    console.log("Inside uploadRouter.get")
    const drive = google.drive({ version: 'v3', auth });
    getList(drive, '');
    setTimeout(() => {
        res.send(driveFiles);
    },1000);
  });


uploadRouter.post("/getFile/:id", async (req,res) => {
    const drive = google.drive({version: 'v3', auth});
    var dest = fs.createWriteStream(req.body.name);
    const fileStream = fs.createWriteStream(req.body.name);
    console.log("File to be downloaded "+req.body.name)
    drive.files.get(
        {fileId: req.body.id, alt: 'media'},
        {responseType: "stream"},
        (err, {data}) => {
          if (err) {
            console.log(err);
            return;
          }
          data
            .on("end", () => console.log("Done."))
            .on("error", (err) => {
              console.log(err);
              return process.exit();
            })
            .pipe(dest);
        }
      );
      const file = await drive.files.get({
        fileId: req.body.id,
        alt: 'media',
    }, {
            responseType: "stream"
        }
    );
    file.data.on('end', () => console.log('onCompleted'))
    file.data.pipe(fileStream);
})
  
  module.exports = uploadRouter;


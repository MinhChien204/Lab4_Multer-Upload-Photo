const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Thiết lập lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const arr = fileName.split(".");
    let newFileName = "";
    for (let i = 0; i < arr.length; i++) {
      if (i !== arr.length - 1) {
        newFileName += arr[i];
      } else {
        newFileName += `-${Date.now()}.${arr[i]}`;
      }
    }
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

// Tải lên một file
app.post("/uploadfile", upload.single("myfile"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Vui lòng upload file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});
//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 5), (req, res, next) => {
  const files = req.files
  if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
  }
  res.send(files)
})


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/upload.html");
});

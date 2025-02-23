const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const multer = require('multer');
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const workRoute = require("./routes/work");
const userRoute = require("./routes/user");
const stripeRoute = require("./routes/stripe");
const orderRoute = require("./routes/order");
const path = require('path');
app.use(express.static(path.join(__dirname, 'images')));
//middleware
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/auth", authRoute);
app.use("/images",express.static(path.join(__dirname,"/images")));
app.use("/api/work", workRoute);
app.use("/api/user", userRoute);
app.use("/api", stripeRoute);
app.use("/api", orderRoute);

//mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });


//image upload
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,"images")
  },
  filename:(req,file,cb)=>{
      cb(null,req.body.img)
  }
})


const upload = multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
  res.status(200).json("Image has been uploaded successfully!")
})
app.post("/api/multiUpload",upload.array("files", 10),(req,res)=>{
  res.status(200).json("Images have been uploaded successfully!")
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})
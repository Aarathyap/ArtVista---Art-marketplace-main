const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      category: {
        type: String,
      },
      title: {
        type: String
      },
      description: {
        type: String
      },
      price: {
        type: Number
      },
      workPhotos: [{type: String}]
    
})

const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);

module.exports = Work;
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../verifyToken"); 
const Work = require("../models/WorkModel");

//Create a new work
router.post("/create", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const {creator, category, title, description, price, pictures } = req.body;
    const newWork = new Work({
        creator,
        category, 
        title, 
        description, 
        price, 
        workPhotos:pictures
    });
    const savedWork = await newWork.save();
    res.status(200).json({ message: "Work published successfully!"})
    } catch (error) {
        return res.status(500).json(error);
    }
});


//Get work details
router.get("/:id", async(req, res)=> {
    try {
        const work = await Work.findById(req.params.id).populate("creator");
        res.status(200).json(work);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Update
router.patch("/:id", verifyToken, async(req, res)=> {
    try {
        const { category, title, description, price, pictures } = req.body;
        const existingWork = await Work.findById(req.params.id);
        if(!existingWork){
            res.status(404).json({ message: "Work not found!"});
        }
        /* Update the Work with the new data */
        existingWork.category = category
        existingWork.title = title
        existingWork.description = description
        existingWork.price = price
        existingWork.workPhotos = pictures
 
        const savedWork = await existingWork.save();
        res.status(200).json(savedWork); 
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete
router.delete("/:id", verifyToken, async(req, res)=> {
    try {
        await Work.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Work deleted successfully!"});
    } catch (error) {
        res.status(500).json(error);
    } 
})

//categorize
router.get("/list/:category", async(req, res)=> {
    try {
        const { category } = req.params;
        
        let workList;

        if(category !== "All"){
             workList = await Work.find({ category }).populate("creator");
        }else{
            workList = await Work.find().populate("creator");
        }
        res.status(200).json(workList);
    } catch (error) {
        res.status(500).json(error);
    }
})


router.get("/search/:query", async(req, res)=> {
    try {
        const { query } = req.params;

        let works = [];

    if (query === "all") {
      works = await Work.find().populate("creator");
    } else {
      works = await Work.find({
        $or: [
          { 'category': { $regex: query, $options: "i" } },
          { 'title': { $regex: query, $options: "i" } },
        ]
      }).populate("creator");
    }
    if(!works){
        res.status(404).json("No works found!");
    }
    res.status(200).json(works);

    } catch (error) {
       res.status(500).json(error); 
    }
})



module.exports = router;
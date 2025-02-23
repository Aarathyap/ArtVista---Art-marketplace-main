const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../verifyToken"); 
const Work = require("../models/WorkModel");
const User = require("../models/UserModel");


// Fetch all users (Admin Only)
router.get("/me", verifyToken, async (req, res) => {
    try {
        console.log("🔹 Fetching user profile for:", req.userId);
        const user = await User.findById(req.userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("❌ Error in /me:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



// Delete a user (Admin Only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted successfully!" });
    } catch (error) { 
        res.status(500).json(error);
    }
});


router.get("/:id/shop", async(req, res)=> {
    try {
        const user = await User.findById(req.params.id);
        const workList = await Work.find({ creator: req.params.id }).populate("creator");

        user.works = workList;
        await user.save();
        res.status(200).json({ user: user, workList: workList });
    } catch (error) { 
        res.status(500).json(error);
    }
})


router.patch("/:id/wishlist/:wId", async(req, res)=> {
  try {
    const userId = req.params.id;
    const workId = req.params.wId;

    const user = await User.findById(userId);
    const work = await Work.findById(workId).populate("creator");

    const favoriteWork = user.wishlist.find((item) => item._id.toString() === workId)

    if (favoriteWork) {
        user.wishlist = user.wishlist.filter((item) => item._id.toString() !== workId);
        await user.save()
        res.status(200).json({ wishlist: user.wishlist });
      } else {
        user.wishlist.push(work);
        await user.save()
        res.status(200).json({ wishlist: user.wishlist });
      }
  } catch (error) {
     res.status(500).json(error);
  }
})


router.get("/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password,...info} = user._doc
        res.status(200).json(info)
    }
    catch(err){
        res.status(500).json(err)
    }
});


router.post("/:id/cart",verifyToken, async(req, res)=> {
    try {
       const { cart } = req.body;
       const userId = req.params.id;
       const user = await User.findById(userId)
       user.cart = cart
       await user.save()
       res.status(200).json(user.cart);
    } catch (error) {
       res.status(500).json(error); 
    }
})



module.exports  = router;
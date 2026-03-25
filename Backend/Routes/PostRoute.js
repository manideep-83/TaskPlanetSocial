const express=require('express');
const router=express.Router();
const Post=require('../schema/posts');
//create a post
router.post('/createPost',async (req,res)=>{
    try{
         const { text, image, userId } = req.body;
         if (!text && !image) {
            return res.status(400).json({ success: false, error: "Text or image required" });
          }
        const post=await Post.create({
            userId:userId,
            text:text,
            image:image
        });
        const populatedPost = await post.populate("userId", "name");
        res.json({ success: true, post: populatedPost });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
      }
});
//get all posts
router.get('/getAllPosts',async (req,res)=>{
    try{
      const posts = await Post.find()
      .populate("userId", "name")
      .populate("comments.userId", "name")
      .populate("likes", "name") 
      .sort({ createdAt: -1 });
    
    // res.json({ success: true, posts });
    res.json({ success: true, posts:posts });

  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});
//liking/disliking a post
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // 🔥 REMOVE NULL VALUES FIRST
    post.likes = post.likes.filter(id => id);

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});
  //adding comment in post
router.post("/:id/comment", async (req, res) => {
    try {
      const { userId, text } = req.body;
      if (!text) {
        return res.status(400).json({ success: false, error: "Comment required" });
      }
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      post.comments.push({
        userId,
        text
      });
      await post.save();
      res.json({
        success: true,
        comments: post.comments
      });
  
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
module.exports = router;
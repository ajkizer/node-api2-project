const express = require("express");
const db = require("./db.js");
const router = express.Router();

//Get posts

router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error finding posts"
    });
  }
});

//get post by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.findById(id);
    post.length > 0
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({
      message: "Error loading post"
    });
  }
});

//get comments on post
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await db.findCommentById(id);
    comment.length > 0
      ? res.status(200).json(comment)
      : res.status(404).json({ message: "Comment not found" });
  } catch (error) {
    res.status(500).json({
      message: "Error loading comments"
    });
  }
});

//add a post
router.post("/", async (req, res) => {
  try {
    if (req.body.title && req.body.contents) {
      const post = await db.insert(req.body);
      res.status(201).json(post);
    } else {
      res.status(400).json({
        errorMessage: "please provide both title and contents"
      });
    }
  } catch (error) {
    res.status(500).json({ message: "error processing request" });
  }
});

router.post("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const commentData = { post_id: id, text: req.body.text };
  const post = await db.findById(id);

  try {
    if (!post.length) {
      res.status(404).json({ message: "post does not exist" });
    } else if (!commentData.text || !commentData.text.length) {
      res.status(400).json({ message: "Please enter text" });
    } else {
      const newComment = await db.insertComment(commentData);
      const newCommentInfo = await db.findCommentById(newComment.id);
      res.status(201).json(newCommentInfo);
    }
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the comment to the database"
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const post = await db.findById(id);

  try {
    if (!post.length) {
      res.status(404).json({ message: "post not found" });
    } else if (!changes.title || !changes.contents) {
      res.status(400).json({ message: "please add title and text" });
    } else {
      await db.update(id, changes);
      const updatedPost = await db.findById(id);
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res.status(500).json({
      message: "There was a problem updating the post in the database"
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await db.findById(id);

  try {
    if (!post.length) {
      res.status(404).json({ message: "Post not found" });
    } else {
      await db.remove(id);
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" });
  }
});
module.exports = router;

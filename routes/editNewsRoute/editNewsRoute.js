const express = require("express");
const upload = require("../../middleware/upload");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const cloudinary = require("../../config/cloudinary");
const supabase = require("../../config/supabaseClient");
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id);
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
      error,
    });
  }
});
router.put(
  "/",
  authMiddleware(["subAdmin", "admin"]),
  upload.single("editedImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { id, title, body, subHeading } = req.body;

      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "news_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });
      // Update database
      const { data, error } = await supabase
        .from("news")
        .update({
          title: title,
          body: body,
          image: result.secure_url,
          is_active: 1,
          simple_heading: subHeading,
        })
        .eq("id", id);

      if (error) {
        res.status(500).json({ message: "bad request" });
      }

      res.json({
        message: "News updated successfully",
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  },
);

module.exports = router;

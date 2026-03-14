const express = require("express");
const upload = require("../../middleware/upload");
require("dotenv").config();
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const cloudinary = require("../../config/cloudinary");
const supabase = require("../../config/supabaseClient");
const { type } = require("node:os");
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("news").select("*");
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/",
  authMiddleware(["subAdmin", "admin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image file is required",
        });
      }

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "news_images",
        },
        async (error, cloudResult) => {
          if (error) {
            return res.status(500).json({
              message: error.message,
              type: "error",
            });
          }

          const { id, title, body, subHeading } = req.body;

          const { data, error: dbError } = await supabase
            .from("news")
            .insert([
              {
                user_id: id,
                title: title,
                body: body,
                simple_heading: subHeading,
                is_active: 1,
                image: cloudResult.secure_url,
              },
            ])
            .select();

          if (dbError) {
            return res.status(500).json({
              message: dbError.message,
            });
          }

          res.json({
            message: "news added successfully",
            data,
            imageUrl: cloudResult.secure_url,
          });
        },
      );

      stream.end(req.file.buffer);
    } catch (error) {
      res.status(500).json({
        message: "upload failed",
        error: error.message,
      });
    }
  },
);

module.exports = router;

  const express = require("express");
  const upload = require("../middleware/upload");

  const router = express.Router();

  router.post(
    "/image",
    upload.single("image"),
    (req, res) => {
      try {
        res.json({
          imageUrl: req.file.path,
        });
      } catch (err) {
        res.status(500).json({
          message: "Upload Failed",
        });
      }
    }
  );

  module.exports = router;
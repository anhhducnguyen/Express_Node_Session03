const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.json({
        message: "Get all user successfully",
    });
});

router.get("/:id", function (req, res) {
    res.json({
        message: "Get user successfully",
    });
});

router.post("/", function (req, res) {
    res.json({
        message: "Create user successfully",
    });
});

router.put("/:id", function (req, res) {
    res.json({
        message: "Update user successfully",
    });
});

router.delete("/:id", function (req, res) {
    res.json({
        message: "Delete user successfully",
    });
});

module.exports = router;
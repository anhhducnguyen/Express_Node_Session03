const express = require('express');
const router = express.Router();
const checkStatus = require("../middlewares/checkStatus");
const checkRoles = require("../middlewares/checkRoles");

router.get("/", checkStatus, checkRoles, (req, res) => {
    // http://localhost:3000/test-middleware/?status=1&role=1
    res.json({ 
        message: "This is a test middleware",
    });
})

module.exports = router;
module.exports = (err, req, res, next) => {
    console.log("Fix bug");
    console.error(err);
    res.status(500).json({
        message: "Something went wrong",
    });
}
module.exports = (req, res, next) => {
    let role = req.query.role;
    if (role === '1') {
        next();
    } else {
        res.json({
            message: "Invalid role",
        });
    }
}
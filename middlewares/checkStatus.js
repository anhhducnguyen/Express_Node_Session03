// Cấu trúc middleware
// Kiểm tra xem request được gửi lên trên server
// có tồn tại 1 trạng thái status = 1 hay không
// - Nếu có thì tiếp tục response về phía client
// - Nếu không ngay lập tức dừng quá trình req res cycle


module.exports = (req, res, next) => {
    let status = req.query.status;
    if (status === '1') {
        next();
    } else {
        res.status(403).json({
            message: "Access denied",
        });
    }
}
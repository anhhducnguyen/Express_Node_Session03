const checkExistsTodo = function(req, res, next) {
    let id = req.params.id;
    let todo = todos.find(function(e, i) {
        return e.id === id;
    });

    if (!todo) {
        return res.json({
            message: "Todo not found",
        })
    } else {
        req.todo = todo;
        next();
    }
}
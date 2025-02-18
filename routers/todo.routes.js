const express = require('express');
const fs = require('fs');
const rootURL = __dirname + "/../data"
const router = express.Router();

router.get("/", function (req, res) {
    console.log(__dirname);
    
    let todos = fs.readFileSync( rootURL + "/todo.json");
    todos = JSON.parse(todos);
    res.json(todos);
});

router.get("/:id", function (req, res) {
    let id = req.params.id;
    let todos = fs.readFileSync(rootURL + "/todo.json");

    todos = JSON.parse(todos);

    let findTodo = todos.find(function (e, i) { 
        return e.id == +id;
    });

    if (findTodo) {
        res.json(findTodo);
    } else {
        res.status(404).json({ message: "Not found" });
    }
});

router.post("/", function (req, res) {
    let newTodo = { ...req.body, id: Math.random() };
    let todos = fs.readFileSync(rootURL + "/todo.json");

    todos = JSON.parse(todos);
    todos.push(newTodo);

    fs.writeFileSync(rootURL + "/todo.json", JSON.stringify(todos));
    res.status(201).json(newTodo);
});

router.put("/:id", function (req, res) {
    let id = req.params.id;
    let todos = fs.readFileSync(rootURL + "/todo.json");
    
    todos = JSON.parse(todos);
    
    let findIndex = todos.findIndex(function (e, i) { 
        return e.id == +id;
    });

    if (findIndex >= 0) {
        todos[findIndex] = {...req.body, id };
        fs.writeFileSync(rootURL + "/todo.json", JSON.stringify(todos));
        res.json(todos[findIndex]);
    } else {
        res.status(404).json({ message: "Not found" });
    }
});

router.delete("/:id", function (req, res) {
    let id = req.params.id;
    let todos = fs.readFileSync(rootURL + "/todo.json");
    
    todos = JSON.parse(todos);
    
    let findIndex = todos.findIndex(function (e, i) { 
        return e.id == +id;
    });
    
    if (findIndex >= 0) {
        todos.splice(findIndex, 1);
        fs.writeFileSync(rootURL + "/todo.json", JSON.stringify(todos));
        res.json({ message: "Deleted successfully" });
    } else {
        res.status(404).json({ message: "Not found" });
    }
});

module.exports = router;
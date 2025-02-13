// Exercise 01: Khởi tạo Web Server với Express.js
const { log } = require('console')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 3000

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Exercise 02: Routing trong Express.js
app.get("/", (req, res) => {
    res.send("<h1>This is homepage</h1>");
})

app.get("/overview", (req, res) => {
    res.send("<h1>This is overview page</h1>");
})

app.get("/product", (req, res) => {
    res.send("<h1>This is product page</h1>");
})

// Exercise 03: Xây dựng API với Express.js
// Bước 1: Tạo GET request lấy danh sách Users

let users;
try {
    users = fs.readFileSync("./starter/dev-data/users.json", { encoding: "utf8" });
    users = JSON.parse(users);
} catch (error) {
    console.error("Error reading JSON file: ", error.message);
    process.exit(1);
}

const checkExists = function(req,res,next){
    let id = req.params.id;
    let email = req.body.email;
    let findIndexId = users.findIndex(function(e,i){
        return e._id === id;
    });

    let findIndexEmail = users.findIndex(function(e,i){
        return e.email === email;
    });
    if(findIndexId < 0 && findIndexEmail < 0){
        return res.json({ 
            message: "User not found"
        });
    }else{
        req.findIndex = findIndexId;
        req.user = users[findIndexId];
        next();
    }
}

app.get("/api/v1/users", checkExists, (req, res) => {
    res.status(200).json(users);
})

// Bước 2: Tạo GET request lấy User theo ID
app.get("/api/v1/users/:id", checkExists, (req, res) => {
    res.status(200).json(req.user);
})

// Bước 3: Tạo POST request để thêm mới User
app.post("/api/v1/users", (req, res) => {    
    let newUser = { ...req.body, _id: Math.random() } 
    users.push(newUser);

    fs.writeFileSync("./starter/dev-data/users.json", JSON.stringify(users));
    res.status(200).json( { 
        message: "Create successfully" 
    });
})

// Bước 4: Tạo PUT request để cập nhật User
app.put("/api/v1/users/:id", checkExists, (req, res) => {
    let user = { ...req.body };
    users[req.findIndex] = user;

    fs.writeFileSync("./starter/dev-data/users.json", JSON.stringify(users));
    res.status(200).json({
        message: "Update successfully"
    });
})

// Bước 5: Tạo DELETE request để xóa User
app.delete("/api/v1/users/:id", checkExists, (req, res) => {
    users.splice(req.findIndex, 1);
    fs.writeFileSync("./starter/dev-data/users.json", JSON.stringify(users));
    res.status(200).json({
        message: "Delete successfully"
    });
})

app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
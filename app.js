const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const hostname  = 'localhost'

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// endpoints or url 
// fucntion không tên request(clinet truy cập /) và respone (trả về data cho clinet) 
app.get('/', (req, res) => {
  res.send('Trang chủ')
})

// GET - all lấy toàn bộ thông tin của users - http://localhost:3000/users
app.get("/users", (req, res) => {
    let users = fs.readFileSync("./data/user.json", { encoding : 'utf8' });
    users = JSON.parse(users);
    res.json(users); // trả về định dạng dưới dạng json 
    // res.end(); // trả về bất kì dữ liệu gì
})

// GET - one lấy toàn bộ thông tin của users - http://localhost:3000/users
app.get("/users/:id", (req, res) => {
    let id = req.params.id;
    let users = fs.readFileSync("./data/user.json", { encoding : 'utf8' });
    
    users = JSON.parse(users);

    let findUser = users.find(function (e, i) { 
        return e.id == +id;
    });

    if (findUser) {
        res.json(findUser);
    } else {
        res.status(404).send("User not found");
    }
})

// POST - thêm mới người dùng
app.post("/users", (req, res) => {
    // console.log(req.body);
    let newUser = { ...req.body, id: Math.random() };
    let users = fs.readFileSync("./data/user.json", { encoding : 'utf8' });

    users = JSON.parse(users);
    users.push(newUser);
   
    fs.writeFileSync("./data/user.json", JSON.stringify(users));
    res.json('Thêm người dùng thành công')
})

// PUT - cập nhật thông tin người dùng :id -> là router parameters, giúp lấy dữ liệu tự động từ url
app.put("/users/:id", (req, res) => {
    // console.log(req.body);
    res.send(`Cập nhật thông tin người dùng có ID: ${req.params.id}`)
    let id = req.params.id;
    let users = fs.readFileSync("./data/user.json", { encoding : 'utf8' });
    
    users = JSON.parse(users);
    
    let findUser = users.find(function (e, i) { 
        return e.id == +id;
    });
    
    if (findUser) {
        findUser.name = req.body.name;
        findUser.email = req.body.username;
        findUser.age = req.body.email;
    } else {
        res.status(404).send("User not found");
    }

    fs.writeFileSync("./data/user.json", JSON.stringify(users));
    res.json('Cập nhật thông tin thành công')
})

// DELETE - xóa người dùng
app.delete("/users/:id", (req, res) => {
    let id = req.params.id;
    let users = fs.readFileSync("./data/user.json", { encoding : 'utf8' });
    
    users = JSON.parse(users);
    
    let index = users.findIndex(function (e, i) { 
        return e.id == +id;
    });
    
    // console.log(index);
    
    
    if (index !== -1) {
        users.splice(index, 1);
        res.send(`Xóa người dùng có ID: ${req.params.id}`)
    } else {
        res.status(404).send("User not found");
    }

    fs.writeFileSync("./data/user.json", JSON.stringify(users));
})

app.listen(port, hostname, () => {
  console.log(`Example app listening on port http://${hostname}:${port}/`)
})
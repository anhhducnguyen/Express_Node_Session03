const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const port = 3000

// Import Routter
const userRouter = require("../routers/user.routes")
const todoRouter = require("../routers/todo.routes")
const testMiddleware = require("../routers/testMiddleware.routes")
// Middleware
const checkStatus = require("../middlewares/checkStatus")
const catchError = require("../middlewares/errorHandler")

app.use(morgan("dev")); // phải cho lên trên cùng
app.use(express.static("public"));

// 1. Application-level middleware 
app.use(checkStatus);

// 2. Middleware router
// const checkStatus = require("./middlewares/checkStatus")
// const checkRoles = require("./middlewares/checkRoles")
// const catchError = require("./middlewares/errorHandler")

// 3. Built-in middleware - // 4. Third-party middleware (Middleware của bên thứ ba)
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// app.use(morgan("dev")); // phải cho lên trên cùng

// 5. (Error-handling middleware)
// app.use(catchError); // nên đặt cuối cùng sau các router

// Routter
app.get("/", (req, res) => {
    res.sendFile('public/todo-list-layout.html', { root:__dirname });
})

app.use("/users", userRouter);
app.use("/todo", todoRouter);
app.use("/test-middleware", testMiddleware);
app.use(catchError);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const port = 3000

const userRouter = require("./routers/user.routes")
const todoRouter = require("./routers/todo.routes")
const testMiddleware = require("./routers/testMiddleware.routes")

const checkStatus = require("./middlewares/checkStatus")
const catchError = require("./middlewares/errorHandler")

app.use(morgan("dev")); 
app.use(express.static("public"));
app.use(checkStatus);
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

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
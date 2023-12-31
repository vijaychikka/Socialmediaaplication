const express = require('express')
const hbs = require('hbs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { readPosts, readUser, insertPost, insertUser, likeFun, shareFun, deleteFun } = require('./operations')

const app = express();

app.set('view engine', 'hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    // req.body.profile
    // req.body.password
    const output = await readUser(req.body.profile)
    const password = output[0].password
    if (password === req.body.password) {
        const payload = { "profile": output[0].profile, "name": output[0].name, "headline": output[0].headline }
        const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"
        const token = jwt.sign(payload, secret)
        res.cookie("token", token)
        res.redirect("/posts")
    } else {
        res.send("Invalid username or password")
    }
})

app.get("/posts", verifyLogin, async (req, res) => {
    const output = await readPosts()
    res.render("posts", {
        data: output,
        userInfo: req.payload
    })
})

function verifyLogin(req, res, next) {
    const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"
    const token = req.cookies.token
    jwt.verify(token, secret, (err, payload) => {
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/addusers", async (req, res) => {
    if (req.body.password == req.body.confirmpassword) {
        await insertUser(req.body.name, req.body.profile, req.body.password, req.body.headline)
        res.redirect("/")
    } else {
        res.send("passwords doesn't match")
    }
})

app.post("/like", async (req, res) => {
    await likeFun(req.body.content)
    res.redirect("/posts")
})

app.post("/shares", async (req, res) => {
    await shareFun(req.body.content)
    res.redirect('/posts')
})

app.post('/addPosts', async (req, res) => {
    await insertPost(req.body.profile, req.body.content)
    res.redirect('/posts')
})

app.post("/delete", async (req, res) => {
    await deleteFun(req.body.content)
    res.redirect('/posts')
})

app.listen(3000, () => {
    console.log("Server is running")
})
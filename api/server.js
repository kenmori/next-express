const { PrismaClient } = require("@prisma/client");
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>")
});

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })
  return res.json({user})
})

// ユーザーログインAPI

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if(!user){
    return res.status(401).json({ error: "存在しません" });
  }
  console.log(user)
  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log(isPasswordValid)
  if(!isPasswordValid){
    return res.status(401).json({ error: "そのバスワードは間違っています"})
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  })
  return res.json({token})
})

const PORT = 5050
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

const express = require("express")

const app = express()

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>")
});
const PORT = 5050
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

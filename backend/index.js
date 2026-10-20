const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

const userRouter = require("./routes/userRouter")
const accountRouter = require("./routes/accountRouter")

app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)


app.listen(3000, () => {
    console.log("Server running on port 3000")
})
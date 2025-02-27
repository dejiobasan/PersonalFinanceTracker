const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();
const port = Number(process.env.PORT);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

mongoose.connect(process.env.FinanceDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

const UserRouter = require("./Routes/Users");
const TransactionRouter = require("./Routes/Transactions");
const ProfileRouter = require("./Routes/Profile");

app.use("/Users", UserRouter);
app.use("/Transactions", TransactionRouter);
app.use("/Profile", ProfileRouter);

app.listen(port, function () {
  console.log(`server started at port ${port}.`);
});

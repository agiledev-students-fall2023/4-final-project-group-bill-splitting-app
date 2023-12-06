// import and instantiate express
const express = require("express"); // CommonJS import style!
const app = express(); // instantiate an Express object
const cors = require("cors");
require("dotenv").config({ silent: true });
const mongoose = require("mongoose");
const path = require('path');

const eventRoute = require("./routes/eventRoute");
const addExpenseRoute = require("./routes/addExpenseRoute");
const friendsPageRoute = require("./routes/friendsPageRoute");
const addFriendRoute = require("./routes/addFriendRoute");
const eventsRoute = require("./routes/eventsRoute");
const addEventRoute = require("./routes/addEventRoute");
const loginRoute = require("./routes/loginRoute");
const addEventMemberRoute = require("./routes/addEventMemberRoute");
const addExpensePayerRoute = require("./routes/addExpensePayerRoute");
const userInfoPageRoute = require("./routes/userInfoPageRoute");
const signupRoute = require("./routes/signupRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const logoutRoute = require("./routes/logoutRoute");
const searchFriendRoute = require("./routes/searchFriendRoute");
const expenseRoute = require("./routes/expenseRoute");
const settlementRoute = require("./routes/settlementRoute");
const expenseStatusRoute = require("./routes/expenseStatusRoute");
const searchUserInfoRoute = require("./routes/searchUserInfoRoute");

// connect to the database
// console.log(`Conneting to MongoDB at ${process.env.MONGODB_URI}`)
try {
  mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB.`);
} catch (err) {
  console.log(
    `Error connecting to MongoDB user account authentication will fail: ${err}`
  );
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Login Successful!");
});
app.get("/signup", (req, res) => {
  res.send("Sign Up Successful!");
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const publicpath = path.join(__dirname, "public");
app.use(express.static(path.join(__dirname, "public")));

app.use("/addExpensePayer", addExpensePayerRoute);
app.use("/add-expense", addExpenseRoute);
app.use("/event", eventRoute);
app.use("/friends", friendsPageRoute);
app.use("/addFriends", addFriendRoute);
app.use("/events", eventsRoute);
app.use("/addEvent", addEventRoute);
app.use("/", loginRoute);
app.use("/user-info", userInfoPageRoute);
app.use("/addEventMember", addEventMemberRoute);
app.use("/signup", signupRoute);
app.use("/forgot-password", forgotPasswordRoute);
app.use("/logout", logoutRoute);
app.use("/searchFriend", searchFriendRoute);
app.use("/expense", expenseRoute);
app.use("/settlement", settlementRoute);
app.use("/search-user-info", searchUserInfoRoute);
app.use("/expenseStatus", expenseStatusRoute);

// export the express app we created to make it available to other modules
module.exports = app;

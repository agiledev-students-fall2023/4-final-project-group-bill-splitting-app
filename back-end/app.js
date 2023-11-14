// import and instantiate express
const express = require("express"); // CommonJS import style!
const app = express(); // instantiate an Express object
const cors = require("cors");

const eventRoute = require("./routes/eventRoute");
const addExpenseRoute = require("./routes/addExpenseRoute");
const homeRoute = require("./routes/homeRoute");
const friendsPageRoute = require('./routes/friendsPageRoute'); 
const addFriendRoute = require('./routes/addFriendRoute'); 
const eventsRoute = require('./routes/eventsRoute');
const addEventRoute = require('./routes/addEventRoute')
const loginRoute = require("./routes/loginRoute");
const addExpensePayerRoute = require("./routes/addExpensePayerRoute"); 
const userInfoPageRoute = require('./routes/UserInfoPageRoute');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/addExpensePayer", addExpensePayerRoute); 
app.use("/add-expense", addExpenseRoute);
app.use("/event", eventRoute); 
app.use("/home", homeRoute);
app.use('/friends', friendsPageRoute); 
app.use('/addFriends', addFriendRoute); 
app.use('/events', eventsRoute);
app.use('/addEvent', addEventRoute);
app.use("/", loginRoute);
app.use("/user-info", userInfoPageRoute);

// export the express app we created to make it available to other modules
module.exports = app;

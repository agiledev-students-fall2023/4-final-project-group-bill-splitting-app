const express = require("express");
const router = express.Router();
const axios =  require('axios');
const { User } = require("../models/User.js");
const Event = require("../models/Event.js");

/*
let eventData = {
  id: 1,
  name: "Karlotte Flewett",
  email: "kflewett0@skyrock.com",
  phone: "669-280-7758",
  avatar: "https://robohash.org/pariaturipsumculpa.png?size=50x50&set=set1",
  events: [
    {
      id: 1,
      EventName: "Coromoro",
      Date: "3/12/2023",
      balance: "$48.03",
      description:
        "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
      members: [{ names: "April Gosker" }, { names: "Viva Rilings" }],
    },
    {
      id: 2,
      EventName: "Kobe",
      Date: "4/17/2023",
      balance: "$-69.91",
      description:
        "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
      members: [
        { names: "Nisse Kearton" },
        { names: "Helen-elizabeth Corpe" },
        { names: "Arther Parffrey" },
      ],
    },
    {
      id: 3,
      EventName: "Ratchathewi",
      Date: "10/30/2022",
      balance: "$96.06",
      description: "Fusce consequat. Nulla nisl. Nunc nisl.",
      members: [{ names: "Annis Badrick" }],
    },
    {
      id: 4,
      EventName: "Cuijiamatou",
      Date: "11/1/2022",
      balance: "$79.17",
      description: "In congue. Etiam justo. Etiam pretium iaculis justo.",
      members: [
        { names: "Emyle McGonigal" },
        { names: "Gwennie McClory" },
        { names: "Arleen Bilson" },
      ],
    },
    {
      id: 5,
      EventName: "Cotabato",
      Date: "6/10/2023",
      balance: "$0.00",
      description:
        "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
      members: [
        { names: "Lazaro Atterbury" },
        { names: "Harriette Hicks" },
        { names: "Cosette Wallsworth" },
      ],
    },
    {
      id: 6,
      EventName: "Krajan",
      Date: "4/25/2023",
      balance: "$37.27",
      description:
        "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
      members: [
        { names: "Kevina Birth" },
        { names: "Javier Wraight" },
        { names: "Sollie Hankinson" },
      ],
    },
  ],
};
router.get("/", (req, res) => {
  res.json(eventData);
});
*/

router.get("/for/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Fetch the user and populate the events
      const userWithEvents = await User.findById(userId)
      .populate({
        path: "events",
        model: "Event",
        populate:{
          path: "expenses",
          model: "Expense",
          populate: {
            path: "splitDetails.settlement",
            model: "Settlement",
          }
        }
      });
  
      if (!userWithEvents) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return the user's events
      res.json(userWithEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  });


module.exports = router;

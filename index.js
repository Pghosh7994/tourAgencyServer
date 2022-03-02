const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4tmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4tmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('database connected')
    const database = client.db("tour");
    const usersCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      // console.log('load user with id: ', id);
      res.send(user);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
       console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });

    //delete Services
    app.delete("/deleteServices/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);

      console.log("deleting user with id ", result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
async function run2() {
  try {
    await client.connect();
    // console.log('connected tour');
    const database = client.db("allOrder");
    const usersCollection = database.collection("orders");
    // GET API
    app.get("/orders", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    // req.params.email;

    app.get("/myorders/:emailOrName", async (req, res) => {
      const user = await usersCollection
        .find({ emailOrName: req.params.emailOrName })
        .toArray();
      // console.log(user);
      res.send(user);
    });

    // POST API
    app.post("/orders", async (req, res) => {
      const newUser = req.body;
      console.log('hit api', newUser)
      // const order = {
      //   "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCox%2527s_Bazar&psig=AOvVaw3E2MpEXF9kLJ3XIUb9seHt&ust=1646340951336000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKDh8tinqPYCFQAAAAAdAAAAABAD",
      //   "service": "Cox's Bazar",
      //   "cost": "2000",
      //   "description": "Cox's Bazar is a city, fishing port, tourism centre, and district headquarters in southeastern Bangladesh",
      //   "status": "valid"
      // }
      const result = await usersCollection.insertOne(newUser);
      // console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });

    //UPDATE API
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      // const updatedUser = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
    });

    // DELETE my order
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);

      console.log("deleting user with id ", result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);
run2().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Server tour");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});

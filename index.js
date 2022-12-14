const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;


//middleware

app.use(cors());


app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.chwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("mobile-hunterDB");
    const userCollection = database.collection("mobile-list");
    const buyerCollection = database.collection("user");

    const reviewCollection = client.db("HSTU").collection("reviews");
    const ordersCollection = database.collection("currentOrder");


    const Schedule_result = client.db("HSTU").collection("addSchedule");
    const Student_result = client.db("HSTU").collection("Results");

    const CseStuResultCollection = database.collection("CSE");



    //POST API for result

    app.post('/addResult', async (req, res) => {
      const updateResult = req.body;
      const result = await Student_result.insertOne(updateResult);
      res.send(result);
    })


    //GET API for results

    app.get('/addResult', async (req, res) => {
      const totalResult = Student_result.find({});
      const studentResult = await totalResult.toArray();
      res.send(studentResult);

    })


    // POST API

    app.post('/addSchedule', async (req, res) => {

      const updateSchedule = req.body;
      const result = await Schedule_result.insertOne(updateSchedule);
      // res.json(result);
      res.send(result);

    })

    //Get API for schedule

    app.get('/addSchedule', async (req, res) => {
      // const query = {};
      const cursor = Schedule_result.find({});
      const Schedules = await cursor.toArray();
      res.send(Schedules);
    });


    //Delete API for Schedule
    app.delete('/addSchedule/:id', async (req, res) => {
      const id = req.params.id;
      // 
      const query = { _id: ObjectId(id) };
      const result = await Schedule_result.deleteOne(query);
      console.log('deleting Schedule with id', result);
      res.json(result);

    })





    //orders post api
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result);
    });

    //all orders get api
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });



    //POST API

    app.post('/reviews', async (req, res) => {
      const addReview = req.body;
      const result = await reviewCollection.insertOne(addReview);

      console.log(addReview)

      res.send(result);
    })


    // get API
    app.get('/reviews', async (req, res) => {

      const reviewcursor = reviewCollection.find({});
      const reviewService = await reviewcursor.toArray();
      res.json(reviewService);
    })


    //Get API

    app.get('/products', async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    })




    //orders post api
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result);
    });






    //


    app.get('/results/:resultID', async (req, res) => {
      const UserID = req.params.resultID;

      console.log(UserID);
      const query = { stuid: UserID }
      const mainUser = await CseStuResultCollection.findOne(query);


      res.send(mainUser);


    });



    //user(admin) get api
    app.get('/users/:email', async (req, res) => {
      const UserEmail = req.params.email;

      console.log(email);
      const query = { email: UserEmail }
      const user = await buyerCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });







    //users post api
    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await buyerCollection.insertOne(users);
      res.json(result);

      console.log(users);
    });

    //users put api

    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const options = { upsert: true }
      const updateDoc = { $set: user }
      const result = await buyerCollection.updateOne(filter, updateDoc, options)
      res.json(result);


    });

    //admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = { $set: { role: 'admin' } }
      const result = await buyerCollection.updateOne(filter, updateDoc)
      res.json(result);

    })



    // post API
    app.post('/addProducts', async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);

      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    })


    // single user display

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };



      const productName = await userCollection.findOne(query);

      console.log('load user with id: ', id);
      res.send(productName);
    })



  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running my Curd server');

});


app.listen(port, () => {
  console.log('Running my curd server on port')
})


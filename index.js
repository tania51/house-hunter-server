const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT | 3004

// middleware
app.use(cors())
app.use(express.json())


const uri = process.env.DB_USER;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('houseHunter').collection('users')
    const houseCollection = client.db('houseHunter').collection('added-houses')

    // jwt api
    // app.post('/jwt', async(req, res) => {
    //   const query = req.body;
    //   const token = jwt.sign(query, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '1hr'})
    //   res.send( {token} )
    // })

    // middlewares
    // const verifyToken = (req, res, next) => {
    //   if(!req.headers.authorization) {
    //     return res.status(401).send({message: 'unauthorized access'})
    //   }
    //   const token = req.headers.authorization.split(' ')[1];
    //   jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
    //     if(err) {
    //       return res.status(401).send({message: 'unauthorized access'})
    //     }
    //     req.decoded = decoded;
    //     next();
    //   })
    //   // next();
    // }


    // create user using post method
    app.post('/users', async(req, res) => {
      const query = req.body;
      const result = await userCollection.insertOne(query);
      res.send(result)
    })

    // get all users info for checking already exits or not
    app.get('/all-user', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    // add house
    app.post('/add-house', async(req, res) => {
      const query = req.body;
      const result = await houseCollection.insertOne(query);
      res.send(result)
    })

    // get all house
    app.get('/all-house', async(req, res) => {
      const result = await houseCollection.find().toArray();
      res.send(result)
    })

    // delete single house
    app.delete('/delete-house/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await houseCollection.deleteOne(query)
      res.send(result)
    })

    // update single house
    // update menu item using patch
    app.patch('/single-house/:id', async(req, res) => {
      const house = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}

      const updatedDoc = {
        $set : {
          hName: house.hName,
          hAddress: house.hAddress,
          hCity: house.hCity
        }
      }

      const result = await houseCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello House Hunters!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
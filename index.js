
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo90p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

    const database = client.db("LifeCareHub");
    const doctorCollection = database.collection("doctorCollection");
    const appointmentDoctorCollection= database.collection("appointmentDoctorCollection");

    app.post ("/doctor",async(req,res)=>{
      const body = req.body;
      const result = await doctorCollection.insertOne(body)
      res.send(result)
    })

    app.get ("/available-doctor",async(req,res)=>{
      const availableDoctor = doctorCollection.find();
      const result = await availableDoctor.toArray();
      res.send(result)
    })

    app.get ("/all-doctor",async(req,res)=>{
      const allDoctor = doctorCollection.find();
      const result = await allDoctor.toArray();
      res.send(result)
    })
    app.get ("/view-details/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const result = await doctorCollection.findOne(filter)
      res.send(result)
    })

    app.post('/appointmentDoctor-post',async(req,res)=>{
      const body = req.body
      const result = await appointmentDoctorCollection.insertOne(body)
      res.send(result)
    })
    app.get('/appointmentDoctor-get',async(req,res)=>{
      const collection = appointmentDoctorCollection.find()
      const result = await collection.toArray()
      res.send(result)
    })

    app.post('/book-appointment',async(req,res)=>{
      const body = req.body
      const result=await appointmentDoctorCollection.insertOne(body)
      res.send(result)
    })

    app.get('/book-appointment',async(req,res)=>{
      const collection = appointmentDoctorCollection.find()
      const result = await collection.toArray()
      res.send(result)
    })
    app.get('/book-appointment/:email',async(req,res)=>{
      const email = req.params.email
      const query = {email: email}
      const result = await appointmentDoctorCollection.find(query).toArray()
      res.send(result)
    })


    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);




app.get('/',async(req,res)=>{
    res.send('Welcome to LifeCare Hub')
})

app.listen(port,()=>{
    console.log(`current port : ${port}`);
})




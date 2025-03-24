require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo90p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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




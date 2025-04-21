const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
  {
    origin:["http://localhost:5173"],
    credentials: true
    
  }
));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("unauthorizedAccess");
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).send("unauthorizedAccess");
    }
    req.user = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo90p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("LifeCareHub");
    const doctorCollection = database.collection("doctorCollection");
    const appointmentDoctorCollection = database.collection(
      "appointmentDoctorCollection"
    );
    const servicesCollection = database.collection("servicesCollection");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1d" });
      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      }).send({status:true})
    });

    app.post('/logout',(req,res)=>{
      res.clearCookie("token",{
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      }).send({status:false})
    })

    app.post("/doctor", async (req, res) => {
      const body = req.body;
      const result = await doctorCollection.insertOne(body);
      res.send(result);
    });

    app.post("/add-services-form", async (req, res) => {
      const body = req.body;
      const result = await servicesCollection.insertOne(body);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const services = servicesCollection.find();
      const result = await services.toArray();
      res.send(result);
    });

    app.get("/available-doctor", async (req, res) => {
      const availableDoctor = doctorCollection.find().limit(4);
      const result = await availableDoctor.toArray();
      res.send(result);
    });

    app.get("/all-doctor", async (req, res) => {
      const category = req.query.category;
      const search = req.query.search;
      let query = {};
      if (category) {
        query.specialization = category;
      }
      if (search) {
        query.doctorName = { $regex: search, $options: "i" };
      }
      const allDoctor = doctorCollection.find(query).sort({ fees: 1 });
      const result = await allDoctor.toArray();
      res.send(result);
    });
    app.get("/view-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await doctorCollection.findOne(filter);
      res.send(result);
    });

    app.post("/appointmentDoctor-post", async (req, res) => {
      const body = req.body;
      const result = await appointmentDoctorCollection.insertOne(body);
      res.send(result);
    });
    app.get("/appointmentDoctor-get", async (req, res) => {
      const collection = appointmentDoctorCollection.find();
      const result = await collection.toArray();
      res.send(result);
    });

    app.post("/book-appointment", async (req, res) => {
      const body = req.body;
      const result = await appointmentDoctorCollection.insertOne(body);
      res.send(result);
    });

    app.get("/book-appointment", async (req, res) => {
      const collection = appointmentDoctorCollection.find();
      const result = await collection.toArray();
      res.send(result);
    });
    app.get("/book-appointment/:email", async (req, res) => {
      const email = req.params.email;
      const query = { Email: email };
      const result = await appointmentDoctorCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/cancel/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await appointmentDoctorCollection.deleteOne(filter);
      res.send(result);
    });

    app.delete("/doctor-delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await doctorCollection.deleteOne(filter);
      res.send(result);
    });
    app.delete("/appointment-delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await appointmentDoctorCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/edit-doctor/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: new ObjectId(id) };
      const doctorUpdateInfo = {
        $set: {
          doctorName: body.doctorName,
          specialization: body.specialization,
          experience: body.experience,
          availableDays: body.availableDays,
          time: body.time,
          city: body.city,
          location: body.location,
          fees: body.fees,
          rating: body.rating,
        },
      };
      const result = await doctorCollection.updateOne(query, doctorUpdateInfo);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to LifeCare Hub");
});

app.listen(port, () => {
  console.log(`current port : ${port}`);
});

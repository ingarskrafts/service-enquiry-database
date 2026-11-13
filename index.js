const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongoUrl = "mongodb://localhost:27017"
const client = new MongoClient(mongoUrl);

let db;

const app = express();
const PORT = 5000;

async function connectToDatabase() {
    await client.connect();

    db = client.db("serviceEnquiryDB");

    console.log("Connected to MongoDB");
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Service Enquiry API is running");

});

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

const sampleEnquiry = {
  customer: "John Smith",
  email: "john@example.com",
  phone: "12345678",
  serviceType: "Electrical installation",
  location: "Sigulda",
  description: "Need new wiring in garage",
  status: "New",
  createdAt: new Date()
};

app.get("/enquiry", (req, res) => {
    res.json(sampleEnquiry);
});

app.post("/enquiry", async (req, res) => {
    const enquiry = {
        customer: req.body.customer,
        email: req.body.email,
        phone: req.body.phone,
        serviceType: req.body.serviceType,
        location: req.body.location,
        description: req.body.description,
        status: "New",
        createdAt: new Date()
    };

    const result = await db.collection("enquiries").insertOne(enquiry);

    res.status(201).json({
        message: "Enquiry created successfully",
        id: result.insertedId,
        enquiry: enquiry
    });
});

app.get("/enquiries", async (req, res) => {
    const enquiries = await db.collection("enquiries").find().toArray();

    res.json(enquiries);
});

app.get("/enquiry/:id", async (req, res) => {
    const id = req.params.id;

    const enquiry = await db
        .collection("enquiries")
        .findOne({ _id: new ObjectId(id) });

        res.json(enquiry);
});
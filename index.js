const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongoUrl = "mongodb://localhost:27017"
const client = new MongoClient(mongoUrl);

let db;

const app = express();
const PORT = 5000;

const allowedStatuses = [
    "New",
    "Contacted",
    "Quoted",
    "Won",
    "Lost"
  ];

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

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid enquiry ID"
        });
      }

    const enquiry = await db
        .collection("enquiries")
        .findOne({ _id: new ObjectId(id) });

        if (!enquiry) {
            return res.status(404).json({
              message: "Enquiry not found"
            });
          }

        res.json(enquiry);
});

app.patch("/enquiry/:id", async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid enquiry ID"
      });
    }
  
    if (!newStatus) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }
  
    const result = await db
      .collection("enquiries")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: newStatus } }
      );
  
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Enquiry not found"
      });
    }
  
    res.json({
      message: "Enquiry status updated successfully"
    });
  });

  app.delete("/enquiry/:id", async (req, res) => {
    const id = req.params.id;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid enquiry ID"
      });
    }
  
    const result = await db
      .collection("enquiries")
      .deleteOne({
        _id: new ObjectId(id)
      });
  
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Enquiry not found"
      });
    }
  
    res.json({
      message: "Enquiry deleted successfully"
    });
  });
  
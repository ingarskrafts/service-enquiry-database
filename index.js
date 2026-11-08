const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Service Enquiry API is running");

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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

app.post("/enquiry", (req, res) => {
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

    res.json(enquiry);
});
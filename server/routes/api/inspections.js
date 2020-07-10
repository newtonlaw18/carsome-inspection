const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Inspections
router.get("/", async (req, res) => {
  const inspections = await loadInspectionsCollection();
  let query = req.query;
  if (query.hasOwnProperty("customer_email")) {
    query["customer_email"] = query.customer_email;
  }
  if (query.hasOwnProperty("inspection_location")) {
    query["inspection_location"] = query.inspection_location;
  }
  if (query.hasOwnProperty("inspection_branch")) {
    query["inspection_branch"] = query.inspection_branch;
  }
  if (query.hasOwnProperty("inspection_date")) {
    query["inspection_date"] = query.inspection_date;
  }
  if (query.hasOwnProperty("inspection_time")) {
    query["inspection_time"] = query.inspection_time;
  }
  res.send(await inspections.find(query).toArray());
});

// get inspection by id
router.get("/:id", async (req, res) => {
  const inspections = await loadInspectionsCollection();
  res.send(await inspections.find(new mongodb.ObjectID(req.params.id)).toArray());
});

// Add Inspection
router.post("/", async (req, res) => {
  const inspections = await loadInspectionsCollection();
  await inspections.insertOne({
    brand: req.body.brand,
    model: req.body.model,
    customer_name: req.body.customer_name,
    customer_email: req.body.customer_email,
    phone_number: req.body.phone_number,
    phone_country_code: req.body.phone_country_code,
    inspection_location: req.body.inspection_location,
    inspection_branch: req.body.inspection_branch,
    inspection_date: req.body.inspection_date,
    inspection_time: req.body.inspection_time,
    createdAt: new Date(),
  });
  res.status(201).send();
});

// Delete Inspection
router.delete("/:id", async (req, res) => {
  const inspections = await loadInspectionsCollection();
  await inspections.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

// Update Inspection
router.put("/:id", async (req, res) => {
  const inspections = await loadInspectionsCollection();
  await inspections.findOneAndUpdate(
    { _id: new mongodb.ObjectID(req.params.id) },
    {
      $set: {
        inspection_location: req.body.inspection_location,
        inspection_branch: req.body.inspection_branch,
        inspection_date: req.body.inspection_date,
        inspection_time: req.body.inspection_time,
        updatedAt: req.body.updatedAt,
      },
    },
    {
      upsert: true,
    }
  );
  res.status(200).send();
});

async function loadInspectionsCollection() {
  const connectionString =
    "mongodb+srv://newton:newton123@cluster0.d1px8.mongodb.net/carsome_db?retryWrites=true&w=majority";
  const client = await mongodb.MongoClient.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client.db("carsome_db").collection("inspections");
}

module.exports = router;

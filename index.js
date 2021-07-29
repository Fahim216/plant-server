const express=require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port =process.env.PORT ||4042;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uswlv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const PlantCollection = client.db("PlantDB").collection("products");
  // perform actions on the collection object
  console.log("connected succefully")

app.get('/plants',(req, res) => {
    PlantCollection.find()
    .toArray((err,items) =>{
        // console.log('from data base',items);
        res.send(items);
    })
})

app.delete('deleteProduct/:id', (req, res) =>{
    const id = ObjectId(req.params.id);
    console.log('deleteProduct',id);
    PlantCollection.findOneAndDelete({_id:id})
    .then(documents=>{
        res.send(documents);
        console.log('deleteProduct')
    })
})




  app.post('/addPlant',(req, res) => {
    const newPlant =req.body;
    console.log('newPlant',newPlant);
    PlantCollection.insertOne(newPlant)
    .then(result=>{
        console.log('inserted count',result.insertedCount>0)
        res.send(result.insertedCount > 0)
    })
})


});








app.get('/', (req, res) => {
  res.send('this is plant shop api! plz login fast')
})

app.listen(process.env.PORT || port)
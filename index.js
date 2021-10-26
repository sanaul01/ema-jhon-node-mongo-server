const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors =require("cors")
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcshw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db("online_Shop");
        const productCollection = database.collection("products")

        // GET API 
        app.get('/products', async(req, res)=>{
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray()
            }

            res.send({
                count,
                products
            });
        });

        // use POST 
        app.post('/products/key', async(req, res)=>{
            const keys = req.body;
            const query = {key: {$in: keys}};
            const products = await productCollection.find(query).toArray();
            res.json(products)
        })
        
    }
    finally {
        // client.close()
    }
}
 
run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send("ema-john")
});

app.listen(port, ()=>{
    console.log("listening ema-john", port)
})
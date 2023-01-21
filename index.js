const express = require('express');
const app = express();
const cors=require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

app.use(express.static('public'))
app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://kawsar30:UEPUaFAsyMaMA4X2@cluster0.n0fnndq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); 

async function run() {
  try{
    await client.connect()
    console.log('connected');
    const productCullection=client.db('groceryDB').collection('product');

    app.get('/', (req, res) => {
        res.send('Hello World!')
      })
      
    app.get("/users",async(req,res)=>{
     
      const query={};
      const cursor=productCullection.find(query);
      const products=await cursor.toArray();
      res.send(products)
    }) 
    app.post('/products', async (req, res) => {
      const user = req.body;
      console.log(user);
       const result = await productCullection.insertOne({name:user.name,email:user.email,unique:user.unique})
       res.send(result);
  });
  
  
  app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            console.log(user)
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    name: user.name,
                    email:user.email
                }
            }
            const result = await productCullection.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        
        
  
  
  
  
  app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
             console.log('trying to delete', id);
            const query = { _id: ObjectId(id) }
           const result = await productCullection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

  }finally {

  }
}
run().catch(err=>console.log(err+"kawsar"))



//index.js


app.listen(process.env.PORT || 3000);

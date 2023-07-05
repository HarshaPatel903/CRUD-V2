const request = require('request');
const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.send('Node API for PET CRUD operations is running v3')
});

app.get('/pets/inBetween', async (req, res) => {
    try {
        const { startTime,endTime } = req.query;
        startTime ? startTime : "0000-00-00T00:00:00.000Z";
        endTime ? endTime : new Date();
        const filter = {};
        if (startTime && endTime) {
            filter.createdAt = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }
        const products = await Product.find(filter);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.get('/pets', async (req, res) => {
    try {
        // Retrieve the filter parameters from the query string
        const { createdAt, updatedAt, petName, petBreed, petType } = req.query;

        // Build the filter object based on the provided parameters
        const filter = {};
        if (createdAt) {
            filter.createdAt = { $gte: new Date(createdAt) };
        }
        if (updatedAt) {
            filter.updatedAt = { $gte: new Date(updatedAt) };
        }
        if (petName) {
            filter.PET_NAME = petName;
        }

        if (petBreed) {
            filter.PET_BREED = petBreed;
        }

        if (petType) {
            filter.PET_TYPE = petType;
        }
        // Find products that match the filter
        const products = await Product.find(filter);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/pets/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.post('/pets', async(req, res) => {
    console.log("dasdasds");
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a product
app.put('/pets/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a product

app.delete('/pets/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/productData', (req, res) => {
     res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    try {
      const pid = req.query.pid;
      console.log("pid");
      console.log(pid);
      const url = "https://servicereminder.el.r.appspot.com/supertailsProductsAssignment";
      
      request.get(url, (error, response, body) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          const data = JSON.parse(body);
          console.log("productList");
          console.log(data);
          
          const productList = data.products;
          console.log(productList.length);
  
          const product = productList.find((p) =>parseInt(p.id) === parseInt(pid));
            console.log(product);
  
          if (product) {
            res.status(200).json(product);
          } else {
            res.status(404).json({ message: "Product not found" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://hapa19cs:VkKcpP7L2EcKoFTw@cluster0.tsckjpz.mongodb.net/CRUD-API?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to MongoDB')
    app.listen(8000, ()=> {
        console.log(`Node API for PET CRUD operations is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})

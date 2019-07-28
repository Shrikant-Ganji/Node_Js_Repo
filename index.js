var express = require('express');
var app = express();
var Datastore = require('@google-cloud/datastore');
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const datastore = new Datastore();

//Welcome Page
app.get('/', (req, res, next)=>{
    res.send("Welcome to GCP PoC");
});

//Get Customers Details
app.get('/getCustomers',(req,res)=>{
    var query=datastore.createQuery('customer');
    datastore.runQuery(query,(err,data)=>{
        if(err)
        console.log(err);
        else
        res.send(data);
    });
});

// Get Customer Details by using ID
app.get('/getCustomerById',(req,res)=>{
    console.log(req.query);
    const id=req.query.id;
    const query = datastore.createQuery('customer').filter('__key__', '=', datastore.key(['customer',id]));
    datastore.runQuery(query,(err,data)=>{
    if(err)
    console.log(err);
    else
    res.send(data);
    });
});

// Adding the New Customer
app.post('/addNewCustomer', (req,res)=> {
    var key=datastore.key(['customer']);
    var entity={
    key:key,
    data:req.body
    };
    datastore.save(entity,(err,data)=>{
    if(err)
    res.status(404).send(err);
    else
        res 
        .status(200)
        .send(data)
        .end();
    });  
});

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, (req, res) => {
     console.log(`Server Listening at Port ${PORT}`);
 });
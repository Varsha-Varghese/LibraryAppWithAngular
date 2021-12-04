const express = require("express");
const port = process.env.PORT || 3000;
const app = new express();
const cors = require('cors');
const path = require ('path');
const jwt=require("jsonwebtoken");
const BookSchema = require("./src/model/Bookdata");
const signupSchema = require("./src/model/signupdata");
const authorSchema = require("./src/model/authordata")
app.use(cors());
app.use(express.static('./dist/frontend'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

username='';
password='';
function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
app.post('/api/login', (req, res) => {
  const uname = req.body.uname;
  const pwd = req.body.password;
  signupSchema.findOne({email:uname, password:pwd}, function(err,user)
          {           
            if(uname=="admin" && pwd=="1234")
              {  
                          
                let payload = {subject: username+password}
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})              
              }
            else if(user)  {
              let payload = {subject: username+password}
              let token = jwt.sign(payload, 'secretKey')
              res.status(200).send({token})   
            }
              else    
              {
                res.status(401).send('Invalid Username/password')      
                console.log("Invalid user name/password"); 
              } 
               
              
          })
        })

app.get("/api/books",verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
    BookSchema.find()
    .then(function(book){
        res.send(book);
    })
   
})
app.get("/api/authors",verifyToken,function(req,res){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
  authorSchema.find()
  .then(function(author){
      res.send(author);
  })
 
})
app.post("/api/insertbook",verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
    console.log(req.body);
   
    var books = {       
        title : req.body.item.title,
        author : req.body.item.author,
        genre : req.body.item.genre,
        image : req.body.item.image
       
   }       
   var book = new BookSchema(books);
   book.save();
})
app.post("/api/insertauthor",verifyToken,function(req,res){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
  console.log(req.body);
 
  var authors = {       
      name : req.body.item.name,
      books : req.body.item.books,     
      image : req.body.item.image
     
 }       
 var author = new authorSchema(authors);
 author.save();
})
app.post("/api/signup",function(req,res){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
  console.log(req.body);
 
  var users = {       
      name : req.body.item.name,
      mobileNo : req.body.item.mobileNo,
      email : req.body.item.email,
      password : req.body.item.password
     
 }       
 var user = new signupSchema(users);
 user.save();
})
app.get('/api/book/:id',  (req, res) => {
  
    const id = req.params.id;
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
      BookSchema.findOne({"_id":id})
      .then((book)=>{
          res.send(book);
      });
  })
  app.get('/api/author/:id',  (req, res) => {
  
    const id = req.params.id;
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,DELETE")
      authorSchema.findOne({"_id":id})
      .then((author)=>{
          res.send(author);
      });
  })
 
  app.put('/api/updatebook',verifyToken,(req,res)=>{
    console.log(req.body)
    id=req.body._id,
    title= req.body.title,
    author = req.body.author,
    genre = req.body.genre,
    image = req.body.image,
 
  BookSchema.findByIdAndUpdate({"_id":id},
                                {$set:{"title":title,
                                "author":author,
                                "genre":genre,
                                "image":image}})
   .then(function(){
       res.send();
   })
 })
 app.put('/api/updateauthor',verifyToken,(req,res)=>{
  console.log(req.body)
  id=req.body._id,
 
  name = req.body.name,
  books = req.body.books,
  image = req.body.image,

authorSchema.findByIdAndUpdate({"_id":id},
                              {$set:{"name":name,
                              
                              "books":books,
                              "image":image}})
 .then(function(){
     res.send();
 })
})
 app.delete('/api/removebook/:id',verifyToken,(req,res)=>{
   
    id = req.params.id;
    BookSchema.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success');
        res.send();
    })
  })
  app.delete('/api/removeauthor/:id',verifyToken,(req,res)=>{
   
    id = req.params.id;
    authorSchema.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success');
        res.send();
    })
  })
  app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/frontend/index.html'))
  });
  app.listen(port,()=>{
    console.log("server is ready at port "+port)
});
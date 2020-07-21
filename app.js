const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const path=require("path");
const methodOverride=require("method-override");
// DATABASE connection
const mongoose=require("mongoose");
const { ENGINE_METHOD_DIGESTS } = require("constants");
mongoose.connect("mongodb+srv://mansoor:M@nsoor123@cluster0.78gep.mongodb.net/blog?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
const blogSchema=new mongoose.Schema(
    {
        title:{type:String,required:true,trim:true},
        image:{type:String,required:true,trim:true},
        body:{type:String,required:true,trim:true},
        created:{type:Date,default:Date.now,trim:true}
    }
);
const blog=mongoose.model("blog",blogSchema);

app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));

// INDEX
app.get("/",(req,res,next)=>
{
    res.redirect("/blogs");
})

app.get("/blogs",(req,res,next)=>
{
    blog.find()
    .then(blogs=>
        {
          res.render("index",{pageTitle:"INDEX PAGE" ,blogs:blogs});
        })
    .catch(err=>
        {
           res.render("error",{pageTitle:"ERROR"});
        })
});

// NEW
app.get("/blogs/new",(req,res,next)=>
{
    res.render("new",{pageTitle:"Create Blog"});
})

// CREATE
app.post("/blogs",(req,res,next)=>
{
    blog.create(req.body.blog)
    .then(blog=>
        {
            res.redirect("/blogs");
        })
    .catch(err=>
        {
            res.render("error",{pageTitle:"ERROR"});
        })
})

// SHOW
app.get("/blogs/:id",(req,res,next)=>
{
    if(req.query._method==="delete")
    {
        next();
    }
    else
    {
    blog.findById(req.params.id)
    .then(blog=>
        {
        res.render("show",{pageTitle:blog.title+"More Info",blog:blog});
        })
    .catch(err=>
        {
            res.render("error",{pageTitle:"ERROR"});
        })    
    }
})

//EDIT
app.get("/blogs/:id/edit",(req,res,next)=>
{
    blog.findById(req.params.id)
    .then(blog=>
        {
            res.render("edit",{pageTitle:"EDIT",blog:blog})
        })
    .catch(err=>
        {
            res.render("error",{pageTitle:"ERROR"});
        })

})
// UPDATE
app.put("/blogs/:id",(req,res,next)=>
{
    blog.findOneAndUpdate(req.params.id,req.body.blog)
    .then(blog=>
        {
            res.redirect("/blogs/"+req.params.id);
        })
    .catch(err=>
        {
            res.render("error",{pageTitle:"ERROR"});
        })    
})

//DELETE
app.get("/blogs/:id",(req,res,next)=>
{
    blog.findByIdAndDelete(req.params.id)
    .then(blog=>
        {
            res.redirect("/blogs");
        })
    .catch(err=>
        {
            res.render("error",{pageTitle:"ERROR"});
        })    
})

app.use("/",(req,res,next)=>
{
    res.render("error",{pageTitle:"ERROR"});
})

app.listen(process.env.PORT ||3000);
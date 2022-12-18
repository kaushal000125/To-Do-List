const express=require("express");
const app=express();
const http=require("http");
const mongoose=require("mongoose");
const _=require("lodash");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.set("view engine","ejs");


 mongoose.connect("mongodb+srv://Kaushal_Chakardhari:<password>@cluster1.ibwz9.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true});
 
const itemsSchema={
  name:String
}

const Item=mongoose.model("Item",itemsSchema);     //Mongoose model

  //Mongoose Document
const item1=new Item({
  name:"Welcome to your todolist!"
});
const item2= new Item({
  name:"Hit the + buttom to add a new item."
});
const item3=new Item({
  name:"<--Hit this to delete an item."
});


const defaultItems=[item1,item2,item3]; 

const listSchema={
  name:String,
  items:[itemsSchema]
};


const List=mongoose.model("List",listSchema);





app.get("/", function(req, res) {
                                                            
Item.find({},function(err,foundItems){                         
  if(foundItems.length==0)                                       
  {
    Item.insertMany(defaultItems,function(err){
       if(err)
       console.log(err);
       else
       console.log("Successfully added!");
    });
  res.redirect("/");                                                  
  }
  else
res.render("list", {listTitle: "Today", newListItems: foundItems});
});
});




app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function(err,foundList){
    if(!err)
    {
      if(!foundList){                                              
        const list=new List({
          name:customListName,
          items:defaultItems
        });
        list.save(function(){                                      
          res.redirect("/"+ customListName);                               
        });
      }
      else
      {
                                                                             
        res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
      }
    }

  });


});

app.post("/", function(req, res){

  const nwItmadded = req.body.newItem;
  const listName=req.body.list;
  const item4=new Item({
    name:nwItmadded
  });
  if(listName==="Today")
  {item4.save();                               
  res.redirect("/");                          
  }                                           
    workItems.push(item);
    res.redirect("/work");
  } 
   else{
    items.push(item);
    res.redirect("/");
  }*/
  else
  {
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item4);
      foundList.save(function(){
        res.redirect("/"+listName);
      });

    });
  }
});


app.post("/delete",function(req,res){
  const checkItemId=req.body.checkbox;             
const listName=req.body.listName;
if(listName==="Today"){
  Item.findByIdAndRemove(checkItemId,function(err){
    if(!err)
    console.log("deleted successfully!");
    res.redirect("/");                              
  });
}
else
{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemId}}},function(err,foundList){
    if(!err)
    res.redirect("/"+listName);
  });
}
});


app.get("/about", function(req, res){
  res.render("about");
});
let port =process.env.PORT;
if(port==null||port=="")
{
  port=3000;
}
app.listen(port, function() {
  console.log("Server started successfully");
});

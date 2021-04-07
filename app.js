const express=require("express");
const app=express();
const http=require("http");
const mongoose=require("mongoose");
const _=require("lodash");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.set("view engine","ejs");


mongoose.connect("mongodb+srv://Kaushal_Chakardhari:Kaushal_1113@cluster0.nc9gg.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true});
//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];
const itemsSchema={
  name:String
}

const Item=mongoose.model("Item",itemsSchema);  //Mongoose model

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


const defaultItems=[item1,item2,item3]; //creating array of mongoose documents to put them in  one go using insertMany()

const listSchema={
  name:String,
  items:[itemsSchema]
};


const List=mongoose.model("List",listSchema);
/*Item.deleteMany({name:"<--Hit this to delete an item."},function(err){
   if(err)
   console.log(err);
   else
   console.log("Successfully deleted!");
});
*/




app.get("/", function(req, res) {
                                                            //const day = date.getDate();
Item.find({},function(err,foundItems){                         //foundItems is array which have whole information of Items
  if(foundItems.length==0)                                       //only in intial case we need to enter the default data
  {
    Item.insertMany(defaultItems,function(err){
       if(err)
       console.log(err);
       else
       console.log("Successfully added!");
    });
  res.redirect("/");                                                  //redirecting to home page will push the data on server using else statement
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
      if(!foundList){                                               //if foundlist did not created then we need to create it and add a new page
        const list=new List({
          name:customListName,
          items:defaultItems
        });
        list.save(function(){                                       //if it already created then we only need to show that page
          res.redirect("/"+ customListName);                                //to redirect to same page otherwise it will hang on
        });
      }
      else
      {
                                                                              //show an exisiting list
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
  {item4.save();                                 //it will save nwItmadded
  res.redirect("/");                           //it will push it on server i.e. it will visible to user
  }                                           /*if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
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
  const checkItemId=req.body.checkbox;             //we r delting the checked entity by getting its id becuase we cann't access the element directly
const listName=req.body.listName;
if(listName==="Today"){
  Item.findByIdAndRemove(checkItemId,function(err){
    if(!err)
    console.log("deleted successfully!");
    res.redirect("/");                              //it redirect to home page i.e. it shows the checkdbox element deleted instantily
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



/*app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});*/

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

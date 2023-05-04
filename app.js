//jshint esversion:6
// Using EJS (Embedded JavaScript Templating) with Express   -->   https://github.com/mde/ejs/wiki/Using-EJS-with-Express
// The res.render() function is used to render a view and sends the rendered HTML string to the client. 
// i.e res.render helps passing data from server (app.js) to webpage (list.ejs) in browser.
// res.send(), res.sendFile(), res.render(), res.redirect() are few response methods.

// <% 'Scriptlet' tag, for control-flow, no output %>     ... for JavaScript expressions (control-flow statements)
// <%= Outputs the value into the template (HTML escaped) %>  ...for HTML-code
// <%- Outputs the unescaped value into the template %>  ...for HTML-code 
// <%# Comment tag, no execution, no output %> 

const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/views/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");  // npm i ejs

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Schema --> Model (collection/table) --> Document (entry/row)

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', { useNewUrlParser: true });  // creates todolistDB database in mongodb server and connects it to mongoose. useNewUrlParser: true -> to avoid deprecated warnings.

const itemsSchema = {   //Schema
    name: String
}

const Item = mongoose.model("Item", itemsSchema);   //Model

const item1 = new Item({    //Document
    name: "Welcome to your todolist!"   // name is field in document item1.
});

const item2 = new Item({
    name: "Click the + button to add a new item."
});

const item3 = new Item({
    name: "Click the checkbox to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {                     // get route created when user access the home route in browser.

    Item.find({}).then((foundItems) => {      // 'Item' is mongoose model/collection.

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems)
                .then(() => {
                    console.log("Successfully saved defult items to DB");
                }).catch((err) => {
                    console.log(err);
                });

            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });    // 'foundItems' contains Item collection in JSON format.   // render "list.ejs" template using ejs view engine      
        }

    }).catch((err) => {
        console.log(err);
    });

});

const listSchema = {
    name: String,  // list name
    items: [itemsSchema]   // items in the list
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }).then((foundList) => {   //foundlist is an object 
            if (!foundList) {
                const list = new List({   //Create a new list
                    name: customListName,
                    items: defaultItems
                });
                list.save();

                res.redirect("/" + customListName);
            }
            else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });    //Show an existing list
            }
        }).catch((err) => {
        console.log(err);
    });

});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;    // using bodyParser and "newItem" as name attribute of the form with method="post" & action="/"
    const listName = req.body.list;       // button has name="list" and its value="listTitle"

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

})

app.post("/delete", (req, res) => {
    // console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).then(() => {
            res.redirect("/");
        }).catch((err) => {
            console.log(err);
        });

    }
    
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: {_id: checkedItemId} } }).then((foundList) => { 
            
            res.redirect("/" + listName);
        }).catch((err) => {
            console.log(err);
        });

    }
});

/*
app.get("/work",(req,res) => {   // another /work route 
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.post("/work", (req,res) => {
    let item = req.body.newItem;
    
    if(req.body.list==="Work"){  // button has name="list" and its value can be 'listTitle' or 'Work'.
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
})
*/

app.listen(3000, () => {
    console.log("Server started on port 3000...");
})



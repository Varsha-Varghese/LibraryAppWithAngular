const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/library");
mongoose.connect("mongodb+srv://userone:userone@fsdfiles.fneg2.mongodb.net/library?retryWrites=true&w=majority");

const Schema = mongoose.Schema;
const BookSchema = new Schema({
    title : String,
    author : String,
    genre : String,
    image : String
});
var Bookdata = mongoose.model("bookdata",BookSchema);
module.exports = Bookdata;

const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/library");
mongoose.connect("mongodb+srv://userone:userone@fsdfiles.fneg2.mongodb.net/library?retryWrites=true&w=majority");

const Schema = mongoose.Schema;
const authorSchema = new Schema({
    name : String,
    books : String,
    image : String
});
var authordata = mongoose.model("authordata",authorSchema);
module.exports = authordata;
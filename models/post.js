const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  imageurl: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
      commentedBy:String
    },
  ],
},{timestamps:true});

mongoose.model("Post", postSchema);

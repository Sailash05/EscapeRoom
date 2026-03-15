  import mongoose from "mongoose";

  const userSchema = new mongoose.Schema({
    userName: { 
      type: String, 
      required: true 
    },

    registerNo: { 
      type: String, 
      unique:true,
      required: true,
      minlength: 12,
      maxlength: 12
    },

    questionsSolved: { 
      type: Number, 
      default: 0 
    }
  });

  const User = mongoose.model("User", userSchema);

  export default User;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    age:{
        type: Number,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
});

export const UserModel = mongoose.model("users",userSchema);
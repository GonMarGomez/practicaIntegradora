import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        require: true
    },
    last_name: {
        type: String,
        minLength: 3,
        require: true
    },
    email: {
        type: String,
        minLength: 3,
        unique: true,
        require: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
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
    }
    ,
    full_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        minLength: 3,
        unique: true,
        required: true 
    },
    
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    age:{
        type: Number
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }],
    ticket: {
        type:[
            {
                ticketInfo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'tickets'
                }
            }
        ],
        default: [],
    },
});


export const userModel = mongoose.model(userCollection, userSchema);
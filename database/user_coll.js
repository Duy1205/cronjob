"use strict";


let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email:  {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    fullName: String,
    password: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    phone: String,
    age: String,
    gender:{
        type: Number,
        // 1: Nam (Male)
        // 0: Nữ   (Female)
        default: 0
    },
    role:{
        type: Number,
        //  1: Admin
        //  2: Editor
        //  0: User 
        default: 0
    },
    token: {
        type: String,
    },
});

let USER_COLL  = mongoose.model('user', userSchema);

module.exports = USER_COLL;
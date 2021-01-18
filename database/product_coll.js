"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    
    name: String,

    price: Number,

    amout: Number,

    avatar: String,

    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },

    status:{
        type: Number,
        default: 0
    }
});

let PRODUCT_COLL = mongoose.model('product', productSchema);

module.exports  = PRODUCT_COLL ;

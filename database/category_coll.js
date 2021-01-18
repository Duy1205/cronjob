"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	products: [{
		type: Schema.Types.ObjectId,
		ref: "product",
	}]
}, {
	timestamps: true
});

// Add index
// LikeSchema.index({user: 1, post: 1}, {unique: true});

let CATEGORY_COLL = mongoose.model('category', categorySchema);

module.exports  = CATEGORY_COLL ;

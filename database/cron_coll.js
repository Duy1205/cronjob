"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cronSchema = new Schema({
// 	second : String,
	minute : String,
	hours : String,
	dayOfMonth : String,
	month : String,
	dayOfWeek : String,
// month : String ,
// day : String,
// hour : String,
// minutes : String,
// second : String

});

// Add index
// LikeSchema.index({user: 1, post: 1}, {unique: true});

let CRON_COLL = mongoose.model('cronjob', cronSchema);

module.exports  = CRON_COLL ;

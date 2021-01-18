"use strict";
const ProductService = require("./products.service");
const fs = require('fs');
const { lookup } = require('dns');
const { listIndexes } = require("../models/products");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "greeter",
	$streamObjectMode: true,

	mixins : [ProductService],

	/**
	 * Settings
	 */
	settings: {

		fields: [
			"_id",
			"name",
			"price",
			"amout",
			"category",
		],

		entityValidator: {
			name:     "string",
			price:    {type: "number", min: 0, convert : true},
			amout:    {type: "number", min: 0, convert : true},
			id:   "string",
			category: "string",
			// status:   "number",
		},
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		async demo(ctx){
			const thing = await ctx.call("products.random2");
			/* 
				Call without Params
			*/
			const age = await ctx.call("helper.age", { title : "Random Number"}, {
				timeout: 500,
				fallbackResponse(ctx, err) {
					return broker.cacher.get("users.fallbackRecommendation:" + ctx.params.title);
				}
			});

			/* 
				Call with Params
			*/

			const metacalled = ctx.call("products.first", { meta: {
				a: "Duy"
			}});

			/* 
				Call with Promise
			*/

			// const thing = await ctx.call("products.random2")
			// 	.then ( res =>  console .log ( "Thanh Cong" )) 
    		// 	.catch ( err =>  console .error ( "Get radndom2 from Product Khong Thanh Cong"));

			ctx.emit("create.name", { thing, age })
			// return {thing, age };
		},


		async loop() {
			const loopEvent = ctx.call("helper.eventLoopFunc")
		},

		async test(ctx) {
			let {name, price, category, amout} = ctx.params;
			// let id = ctx.params.id;

			ctx.emit("products.create", {name, price, category, amout})
			// ctx.emit("products.list")
			// ctx.emit("products.info", {id})
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		getCachedResult(ctx, err) {
            return "Some cached result";
        }
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};

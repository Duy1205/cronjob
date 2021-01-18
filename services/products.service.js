"use strict";

// const DbMixin = require("../mixins/db.mixin");
const DbService                = require("moleculer-db");
const PRODUCT_MODEL			= 	require("../models/products");
const MongooseAdapter          = require("moleculer-db-adapter-mongoose");
const { LoggerFactory } = require("moleculer");
const { CONN_CLOSED } = require("nats");
const nodeXlsx = require('node-excel-export');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost:27017/moleculer-demo", 
		{ 
			useNewUrlParser: true, 
			useUnifiedTopology: true 
		}
	),
	model: PRODUCT_MODEL,

	/**
	 * Settings
	 */
	settings: {
	
	},

	/**
	 * Actions
	 */
	actions: {
		createProduct :{
			handler(ctx){
				return PRODUCT_MODEL.createProduct(ctx.params.name,ctx.params.price, ctx.params.category, ctx.params.amout)
			}
		},

		listProduct: {
			// rest: "GET /list",
			async handler(){
				let listProduct = await PRODUCT_MODEL.getList();
				return listProduct;
			}
		},

		exportExcel() {
			this.exportExcel();
		},

		infoProduct: {
			// rest: "GET /info",
			async handler(ctx){
				let infoProduct = await PRODUCT_MODEL.getInfo(ctx.params.productID);
				return infoProduct;
			}
		},
		
		removeProduct : {
			// rest: "GET /remove/:productID",
			async handler(ctx){
				let infoProduct= await PRODUCT_MODEL.removeProduct(ctx.params.productID)
				return infoProduct
			}
		},

		updateProduct :{
			// rest: "POST /update/:productID",
			async handler(ctx){
				let infoProduct= await PRODUCT_MODEL.updateProduct(ctx.params.productID,ctx.params.name,ctx.params.price, ctx.params.category, ctx.params.amout)
				return infoProduct
			}
		},
	},

	events : {
		
		/*

		WITH MONGOOSE

		*/ 

		// "products.create" (payload) {
		// 	this.createProduct(payload)
		// 	console.log(payload);
		// },

		// "products.list" : {
		// 	handler(){
		// 		this.getList();
		// 	}
		// },

		/*
					
		WITH MOLECULER
		
		*/ 

		// "products.create" : {
		// 	rest: "POST /",
		// },
		
		// "products.list" : {
		// 	async handler(){
		// 		try {
		// 			let listProducts = await PRODUCT_MODEL.find({})
		// 			return this.logger.info({infoProduct})
		// 		} catch (error) {
		// 			return error;
		// 		}
				
		// 	}
		// },

		// "products.info" : {
		// 	params :{

		// 	},
		// 	async handler(payload) {
		// 		console.log(payload);
		// 		let infoProduct = await PRODUCT_MODEL.findById(payload)
		// 		return this.logger.info({infoProduct})
		// 	}
		// },


	},
	/**
	 * Methods
	 */
	methods: {
		exportExcel(req, res) {
			let domain = "http://localhost:82";
			let dataExcel = [];

			PRODUCT_MODEL.find({})

				.then(products => {
					let demo2 = [];
					Object.keys(products[0]['_doc']).forEach(key => {
						"use strict";
						demo2.push(key);
					});
					dataExcel.push(demo2);
					for (let item of products) {
						let demo3 = [];
						Object.keys(item._doc).forEach(key => {
						demo3.push(item[key]);
						});
						dataExcel.push(demo3);
					}
					let buffer = nodeXlsx.buildExport([{name: "List Product", data: dataExcel}]);

					// Thay vì res.attachment('user.xlsx') mình sẽ ghi ra file products.xlsx theo đường dẫn public/exports
					// Sau đó mình tạo 1 liên kết trỏ tới file đó và gửi nó sang trang receive đính kèm theo link
					fs.writeFile('public/exports/products.xlsx', buffer, function (err) {
						if (err) return console.log(err);
						else return res.render('receive', {link: `${domain}/exports/products.xlsx`});
					});
				})

    			.catch(err => console.log(err));
		},
		// createProduct() {
		// 	return new Promise(async resolve => {
		// 		try {
	
		// 			if (!name)
		// 			return resolve({ error: true, message: 'params_invalid' });
	
		// 			let dataInsert = { 
		// 				name, 
		// 				price,
		// 				category, 
		// 				amout
		// 			};
		// 			console.log(dataInsert)
	
		// 			let infoAfterInsert = new PRODUCT_MODEL(dataInsert);
		// 			let saveDataInsert = await infoAfterInsert.save();
	
		// 			if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_post' });
	
		// 			resolve({ error: false, data: infoAfterInsert });
	
		// 		} catch (error) {
		// 			return resolve({ error: true, message: error.message });
		// 		}
		// 	});
		// },
	
		getList() {
			return new Promise(async resolve => {
				try {
					let listPost = await PRODUCT_MODEL.find({})
					
					if (!listPost) return resolve({ error: true, message: 'cannot_get_list_data' });
					console.log(listPost);
					return resolve({ error: false, data: listPost });
	
				} catch (error) {
	
					return resolve({ error: true, message: error.message });
				}
			})
		}
	
	},
		

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};

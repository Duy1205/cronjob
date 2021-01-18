"use strict";
const Cron = require("moleculer-cron");
const cron = require("node-cron")
const parser = require('cron-parser');
const moment = require('moment');
const CRON_MODEL= 	require("../models/cron");
const DbService                = require("moleculer-db");
const MongooseAdapter          = require("moleculer-db-adapter-mongoose");
const PRODUCT			= 	require("./products.service");
/**
 * cronjob service
 */
module.exports = {

	name: "cronjob",

    mixins : [DbService, Cron, PRODUCT],
    
    adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost:27017/moleculer-demo", 
		{ 
			useNewUrlParser: true, 
			useUnifiedTopology: true 
		}
	),
	model: CRON_MODEL,

	/**
	 * Service settings
	 */

	// crons: [
    //     {
    //         name: "getListUser",
    //         cronTime: `${ CRON_MODEL.getList()}`,
            
    //         onTick: async function() {

    //             var job = this.getJob("getListUser");

    //             this.getLocalService("cronjob")
    //                 .actions.listProduct()
    //                 .then((data) => {
    //                     console.log("ListUser", data);
    //                 });
    //                 job.start();
    //             },
            
    //             runOnInit: function() {
    //             console.log("List User is created");
    //         },
    //         // manualStart: true,
    //         timeZone: 'Asia/Ho_Chi_Minh'
    //     },
    // ],

    actions: {
		/**
		* Test action
		*/
		scheduleJob : {
			// async handler(ctx) {
			// 	let apluctaonenkimcuong = this.apluctaonenkimcuong;

			// 	cron.schedule(apluctaonenkimcuong[0].date, () => {
			// 		console.log('running every minute 1, 2, 4 and 5');
			// 	});
			// }
			async handler(ctx) {
				let date = await CRON_MODEL.createCron(ctx.params.minute,ctx.params.hours,ctx.params.dayOfMonth,ctx.params.month,ctx.params.dayOfWeek);
				// let date = await CRON_MODEL.getListCron();
				let secondCron = date.data;
				return this.crontab({secondCron});
			}
		},

		// test2: {
		// 	async handler(ctx) {
		// 		let date ={
		// 			// year: 2020,
		// 			month: 11,
		// 			day: 20,
		// 			hour: 18,
		// 			minutes: 36,
		// 			second: 0
		// 		};

		// 		let cronjob = this.crontab({date});
		// 		console.log(cronjob) ;
		// 	}
		// },

		say: {
            handler(ctx) {
                return "HelloWorld!";
            }
        }
	},

	/**
	 * Events
	 */
	events: {
		async "some.thing"(ctx) {
			this.logger.info("Something happened", ctx.params);
		}
	},

	/**
	 * Methods
	 */
	methods: {
		async crontab({secondCron}) {
			
			console.log( 
				secondCron.minute,
				secondCron.hours,
				secondCron.dayOfMonth,
				secondCron.month,
				secondCron.dayOfWeek,
			);
			
			cron.schedule(`${secondCron.minute} ${secondCron.hours} ${secondCron.dayOfMonth} ${secondCron.month} ${secondCron.dayOfWeek}`, () => {
				this.getList();
			});
			
			moment.locale('vi');

			var interval = parser.parseExpression(`${secondCron.minute} ${secondCron.hours} ${secondCron.dayOfMonth} ${secondCron.month} ${secondCron.dayOfWeek}`);

			return `Xuất danh sách sản phẩm đã lên lịch vào: ${moment(interval.next().toString()).format('LLLL')}`
		},

	// 	checkValid ({date}){
	// 		let { 
	// 			month, 
	// 			day,
	// 			hour,
	// 			minutes,
	// 			second
	// 		} = date;

	// 		if (!month){
	// 			date.month = "*";
	// 		}

	// 		if (day==0){
	// 			date.day = 1;
	// 		}

	// 		if (!day){
	// 			date.day = "*";
	// 		}

	// 		if (!hour && hour != 0){
	// 			date.hour = "*";
	// 		}

	// 		if (!minutes && minutes != 0){
	// 			date.minutes = "*";
	// 		}

	// 		if (!second && second != 0){
	// 			date.second = "*";
	// 		}
	// 		return date;
	// 	}
	},
	

    started() {
		
    }
};

"use strict";
require('dotenv').config()
const DbService             		= require("moleculer-db");
const MongooseAdapter       		= require("moleculer-db-adapter-mongoose");
const USER_MODEL                 	= require("../models/users");
const  {hash, compare, hashSync} 	= require('bcryptjs');
const { MoleculerClientError, ValidationError } 	= require("moleculer").Errors;
const jwt 							= require("jsonwebtoken");

module.exports = {
	name: "users",
	mixins: [DbService],


    adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost:27017/moleculer-test", 
    { useNewUrlParser: true, useUnifiedTopology: true }),
	model: USER_MODEL,

	settings: {
		fields: ["_id", "fullName", "email", "password", "age", "gender", "phone", "role"],
		entityValidator: {
			email: { type: "email" },
			password: { type: "string", min: 6 },
			fullName: { type: "string" },
		},
	
	},
    
    
	actions: {

        register: {
			rest: "POST /register",
            async handler(ctx) {
				let register = await USER_MODEL.register(ctx.params.email, ctx.params.password)
				return register;
			}
		},
		
		login: {
			rest: "POST /login",
			async handler(ctx) {
                return USER_MODEL.signIn(ctx.params.email, ctx.params.password);
            
            }
		},
	},

	events : {

		"sendmail"(payload) {
			this.logger.info(payload);
			this.sendMail( payload.email );
		}

	},

	methods: {

        // register( email, password) {
        //     return new Promise(async resolve => {
        //         try {
        //             let checkExist = await USER_COLL.findOne({ email });
        //             if (checkExist)
        //                 return resolve({ error: true, message: 'email_existed' });
        //             let hashPassword = await hash(password, 8);
        //             let newUser = new USER_COLL({  email, password: hashPassword });
        //             let infoUser = await newUser.save();
        //             if (!infoUser) return resolve({ error: true, message: 'cannot_insert' });
        //             resolve({ error: false, data: infoUser, message : " register_success" });
        //         } catch (error) {
        //             return resolve({ error: true, message: error.message });
        //         }
        //     });
        // },

        // signIn(email, password) {
        //     return new Promise(async resolve => {
        //         try {
        //             const infoUser = await USER_COLL.findOne({ email });
        //             if (!infoUser)
        //                 return resolve({ error: true, message: 'email_not_exist' });
        //             const checkPass = await compare(password, infoUser.password);
        //             if (!checkPass)
        //                 return resolve({ error: true, message: 'password_not_exist' });
        //             await delete infoUser.password;
        //             let token = await sign({ data: infoUser });
        //             return resolve({ error: false, data: { infoUser, token }, message : "Login success" });
        //         } catch (error) {
        //             return resolve({ error: true, message: error.message });
        //         }
        //     });
        // },
    

		async getToken(user) {
			return await this.generateJWT(user);
		},

		generateJWT(payload) {
			// return jwt.sign({
			// 	user,
			// }, process.env.JWT_SECRET);
			return new this.Promise((resolve, reject) => {
				return jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
					if (err) {
						return reject(new MoleculerClientError("Unable to generate token", 500, "UNABLE_GENERATE_TOKEN"));
					}
					resolve(token);
				});
			});
		},

		verifyJWT(token) {
			return new this.Promise((resolve, reject) => {
				jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
					if (err) {
						return reject(new MoleculerClientError("Invalid token", 401, "INVALID_TOKEN"));
					}
					resolve(decoded);
				});
			});
		},
	
		transformEntity(user, withToken, token) {
			if (user) {
				//user.image = user.image || "https://www.gravatar.com/avatar/" + crypto.createHash("md5").update(user.email).digest("hex") + "?d=robohash";
				// user.image = user.image || "";
				if (withToken)
					user.token = token || this.generateJWT(user);
			}

			return { user };
		},
		findUserById( id ) {
			return this.adapter.findOne({ _id: id });
		},
	},

	// async afterConnected() {
	// 	const count = await this.adapter.count();
	// 	if (count == 0) {
	// 		return this.createAnhSon();
	// 	}
	// },

};

const ObjectID = require('mongoose').Types.ObjectId;
const USER_COLL = require('../database/user_coll');

module.exports = class User extends USER_COLL {
    register( email, password) {
            return new Promise(async resolve => {
                try {
                    let checkExist = await USER_COLL.findOne({ email });
                    if (checkExist)
                        return resolve({ error: true, message: 'email_existed' });
                    let hashPassword = await hash(password, 8);
                    let newUser = new USER_COLL({  email, password: hashPassword });
                    let infoUser = await newUser.save();
                    if (!infoUser) return resolve({ error: true, message: 'cannot_insert' });
                    resolve({ error: false, data: infoUser, message : " register_success" });
                } catch (error) {
                    return resolve({ error: true, message: error.message });
                }
            });
        }

        signIn(email, password) {
            return new Promise(async resolve => {
                try {
                    const infoUser = await USER_COLL.findOne({ email });
                    if (!infoUser)
                        return resolve({ error: true, message: 'email_not_exist' });
                    const checkPass = await compare(password, infoUser.password);
                    if (!checkPass)
                        return resolve({ error: true, message: 'password_not_exist' });
                    await delete infoUser.password;
                    let token = await sign({ data: infoUser });
                    return resolve({ error: false, data: { infoUser, token }, message : "Login success" });
                } catch (error) {
                    return resolve({ error: true, message: error.message });
                }
            });
        }
}
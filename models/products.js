const ObjectID = require('mongoose').Types.ObjectId;
const PRODUCT_COLL = require('../database/product_coll');

module.exports = class Product extends PRODUCT_COLL {
    static createProduct(name, price, category,amout) {
        return new Promise(async resolve => {
            try {

                if (!name)
                return resolve({ error: true, message: 'params_invalid' });

                let dataInsert = { 
                    name, 
                    price,
                    category, 
                    amout
                };

                let infoAfterInsert = new PRODUCT_COLL(dataInsert);
                let saveDataInsert = await infoAfterInsert.save();
                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_post' });

                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
	
    static getList() {
        return new Promise(async resolve => {
            try {
                let listProduct = await PRODUCT_COLL.find()
                if (!listProduct) return resolve({ error: true, message: 'cannot_get_list_data' });
                return resolve({ error: false, data: listProduct });
            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getInfo(productID) {
        return new Promise(async resolve => {
            try {
                
                if (!ObjectID.isValid(productID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoProduct = await PRODUCT_COLL.findById(productID)
                if (!infoProduct) return resolve({ error: true, message: 'cannot_get_info_data' });

                return resolve({ error: false, data: infoProduct });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static removeProduct(productID) {
        return new Promise(async resolve => {
            try {
                if (!ObjectID.isValid(productID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await PRODUCT_COLL.findByIdAndDelete(productID);

                if (!infoAfterRemove)
                    return resolve({ error: true, message: 'cannot_remove_data' });

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    
    static updateProduct(productID, name, price, category,amout ) {
        return new Promise(async resolve => {
            try {

                
                if (!ObjectID.isValid(productID) )
                    return resolve({ error: true, message: 'params_invalid' });

                let dataUpdate = {
                    name,
                    price,
                    category, 
                    amout
                }
                
                let infoAfterUpdate = await PRODUCT_COLL.findByIdAndUpdate(productID, dataUpdate, { new: true });
                
                if (!infoAfterUpdate)
                    return resolve({ error: true, message: 'cannot_update_data' });

                return resolve({ error: false, data: infoAfterUpdate, message: "update_data_success" });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }
}
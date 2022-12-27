var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;

module.exports={
    addAddress:(order)=>{
        return new Promise((resolve,reject)=>{
            let orderObj={
                userid:order.userid,
                address:{
                  name:order.name,
                  mobile:order.mobile,
                  address:order.address,
                  city:order.city,
                  state:order.state,
                  pincode:order.pincode,
                  email:order.email,
                }
            }
            db.get()
            .collection(collection.ADDRESS_COLLECTIONS)
            .insertOne(orderObj).then((response) => {
                resolve(response)
            })
            
           
        })

    },getAllAddress:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let address =await db.get().collection(collection.ADDRESS_COLLECTIONS)
           .find({userid:userId})
           .sort({time:-1})
           .toArray()
                resolve(address)
            })
    },getAddress:(addressId)=>{
        return new Promise(async(resolve,reject)=>{
            let address =await db.get().collection(collection.ADDRESS_COLLECTIONS).findOne({_id:objectid (addressId)})
            resolve(address)
        })
    },editAddress:(addressid,address)=>{
        return new Promise((resolve,reject)=>{
            db.get()
            .collection(collection.ADDRESS_COLLECTIONS)
            .updateOne(
                {_id:objectid(addressid)},
                {
                    $set:{
                        address:{
                            name:address.name,
                            mobile:address.mobile,
                            address:address.address,
                            city:address.city,
                            state:address.state,
                            pincode:address.pincode,
                            email:address.email,
                        }
                    }
                }
            ).then(() => {
                
                resolve()
            })
        })
    },deleteaddress:(address)=>{
        return new Promise((resolve,reject)=>{
            db.get()
            .collection(collection.ADDRESS_COLLECTIONS)
            .deleteOne(
              {
                _id: objectid(address),
              }
            )
            .then(() => {
              resolve();
            })

        })
    }
}

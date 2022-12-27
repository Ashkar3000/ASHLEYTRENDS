var db = require("../configure/connection");

var collection = require("../configure/collections");

var objectid = require("mongodb").ObjectId;

module.exports={
  addWishlist:(prodId,userId)=>{
        let proObj = {
            item: objectid(prodId),
            quantity: 1,
          };
        return new Promise(async(resolve,reject)=>{
          let wishlist=await 
          db.get()
          .collection(collection.WISHLIST_COLLECTIONS)
          .findOne({userid:objectid(userId)})
          if (wishlist) {
            let proExist = wishlist.product.findIndex(
              (product) => product.item == prodId
            );
    
            if (proExist != -1) {
              db.get()
                .collection(collection.WISHLIST_COLLECTIONS)
                .updateOne(
                  { userid: objectid(userId), "product.item": objectid(prodId) },
                  {
                    $inc: { "product.$.quantity": 1 },
                  }
                )
                .then(() => {
                  resolve();
                });
            } else {

            db.get()
            .collection(collection.WISHLIST_COLLECTIONS)
            .updateOne(
              { userid: objectid(userId) },
              {
                $push: { product: proObj},
              }
            )
            .then((response) => {
              resolve();
            });
          }
          } else {
            let wishobj={
                userid:objectid(userId),
                product:[proObj]
            }
            db.get()
            .collection(collection.WISHLIST_COLLECTIONS)
            .insertOne(wishobj)
             .then((response) => {
                resolve()
            })
          }
        })
    },
    getWishList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let wish=await 
            db.get().collection(collection.WISHLIST_COLLECTIONS)
            .findOne({userid:objectid(userId)})
            if (wish) {
                let wishItems =await 
                db.get()
                .collection(collection.WISHLIST_COLLECTIONS)
                .aggregate([
                    {
                        $match:{userid:objectid(userId)},
                    },
                    {
                        $unwind:"$product",
                    },
                    {
                        $project:{
                            item:"$product.item",
                            quantity: "$product.quantity",
                        },
                    },
                    {
                        $lookup:
                        {
                            from: collection.PRODUCT_COLLECTION,
                            localField: "item",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $project: {
                          item: 1,
                          quantity: 1,
                          product: { $arrayElemAt: ["$product", 0] },
                        },
                      },
                      {
                        $addFields: {
                          price: { $toInt: "$product.price" },
                        },
                      },
                      {
                        $project: {
                            item: 1,
                            quantity: 1,
                            product: 1,
                          }
                      }
                ])
                .toArray();
                resolve(wishItems)
            } else {
                let data ={}
                data.status = ""
                resolve(data)
            }
        })
    },
    deleteWish: (userId, prodId) => {
        return new Promise((resolve, reject) => {
          db.get()
            .collection(collection.WISHLIST_COLLECTIONS)
            .updateOne(
              {
                userid: objectid(userId),
              },
              {
                $pull: {
                  product: { item: objectid(prodId) },
                },
              }
            )
            .then(() => {
              resolve();
            });
        });
      },
      getwishCount:(userId) => {
        return new Promise(async (resolve, reject) => {
          let count = 0;
          let wish = await db
            .get()
            .collection(collection.WISHLIST_COLLECTIONS)
            .findOne({ userid: objectid(userId) });
          if (wish) {
            count = wish.product.length;
          }
          resolve(count);
        });
      },
}
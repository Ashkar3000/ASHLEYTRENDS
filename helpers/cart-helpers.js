var db = require("../configure/connection");
var collection = require("../configure/collections");

var objectid = require("mongodb").ObjectId;

module.exports = {
  addToCart: (prodId, userId) => {
    let proObj = {
      item: objectid(prodId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (userCart) {
        let proExist = userCart.product.findIndex(
          (product) => product.item == prodId
        );
        if (proExist != -1) {
          db.get().collection(collection.CART_COLLECTIONS)
          .findOne({user:objectid(userId)}).then((result) => {
            console.log("**********************///");
            console.log(result);
            
          }).catch((err) => {
            
          });
          db.get()
            .collection(collection.CART_COLLECTIONS)
            .updateOne(
              { user: objectid(userId), "product.item": objectid(prodId) },
              {
                $inc: { "product.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTIONS)
            .updateOne(
              { user: objectid(userId) },
              {
                $push: { product: proObj },
              }
            )
            .then((response) => {
              resolve(response);
            });
        }
      } else {
        let cartObj = {
          user: objectid(userId),
          product: [proObj],
        };
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .insertOne(cartObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },
   getCartProduct: (userId) => { 
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (cart) {
        if (cart.product.length == 0) {
          let data = {};
          data.status = "Cart is empty";

          resolve(data);
        } else {
         
          let cartItems = await db
            .get()
            .collection(collection.CART_COLLECTIONS)
            .aggregate([
              {
                $match: { user: objectid(userId) },
              },
              {
                $unwind: "$product",
              },
              {
                $project: {
                  item: "$product.item",
                  quantity: "$product.quantity",
                },
              },
              {
                $lookup: {
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
                  offerprice:{$toInt: "$product.offerprice"}
                },
              },
              {
                $project: {
                  item: 1,
                  quantity: 1,
                  product: 1,
                  offstotal:{
                    $multiply: ["$quantity", "$offerprice"],
                  },
                  stotal: {
                    $multiply: ["$quantity", "$price"],
                  },
                },
              },
            ])
            .toArray();
          resolve(cartItems);
        }
      } else {
        let data = {};
          data.status = "";
          resolve(data)
      };
    });
  },
  getCartProductrOrder: (userId) => { 
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (cart) {
        if (cart.product.length == 0) {
          let data = {};
          data.status = "Cart is empty";

          resolve(data);
        } else {
         
          let cartItems = await db
            .get()
            .collection(collection.CART_COLLECTIONS)
            .aggregate([
              {
                $match: { user: objectid(userId) },
              },
              {
                $unwind: "$product",
              },
              {
                $project: {
                  item: "$product.item",
                  quantity: "$product.quantity",
                },
              },
              {
                $lookup: {
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
                  offerprice:{$toInt: "$product.offerprice"}
                },
              },
              {
                $project: {
                  item: 1,
                  quantity: 1,
                  offstotal:{
                    $multiply: ["$quantity", "$offerprice"],
                  },
                  stotal: {
                    $multiply: ["$quantity", "$price"],
                  },
                },
              },
            ])
            .toArray();
          resolve(cartItems);
        }
      } else {
        let data = {};
          data.status = "";
          resolve(data)
      }
    });
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (cart) {
        count = cart.product.length;
      }
      resolve(count);
    });
  },

   changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);

    return new Promise(async (resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .updateOne(
            { _id: objectid(details.cart) },
            {
              $pull: { product: { item: objectid(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .updateOne(
            {
              _id: objectid(details.cart),
              "product.item": objectid(details.product),
            },
            {
              $inc: { "product.$.quantity": details.count },
            }
          )
          .then((response) => {
            resolve(true);
          });
      }
    });
  },
deleteitem: (userId, prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTIONS)
        .updateOne(
          {
            user: objectid(userId),
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
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (cart) {
        if (cart.product.length == 0) {
          let data = {};
          data.status = "Cart is empty";

          resolve(data);
        } else {
          let total = await db
            .get()
            .collection(collection.CART_COLLECTIONS)
            .aggregate([
              {
                $match: { user: objectid(userId) },
              },
              {
                $unwind: "$product",
              },
              {
                $project: {
                  item: "$product.item",
                  quantity: "$product.quantity",
                },
              },
              {
                $lookup: {
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
                  offerprice: { $toInt: "$product.offerprice" },
                },
              },
              {
                $project: {
                  item: 1,
                  quantity: 1,
                  product: 1,
                  stotal: {
                    $multiply: ["$quantity", "$offerprice"],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$stotal" },
                },
              },
            ])
            .toArray();
          resolve(total[0].total);
        }
      }else{
        let data = {};
        data.status = "";
        resolve(data)
      }
    });
  },
};

var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;

module.exports={
    placeOrder:(order,product,total,address)=>{
        return new Promise((resolve,reject)=>{
          product.forEach((Element) => {
            Element.orderStatus="Order Placed"
          });
          let totalAmt = total;
          let couponDiscount = order.finalamoount||0
      if(couponDiscount>0){
        totalAmt = couponDiscount
        couponDiscount = total-couponDiscount
      }
          let status=order.payment==='COD'?"Success":"pending"
          let orderObj={
            address:{
              name:address.address.name,
              mobile:address.address.mobile,
              email:address.address.email,
              address:address.address.address,
              pincode:address.address.pincode
            },
            userid:objectid(order.userid),
            payment:order.payment,
            product:product,
            totalAmount:totalAmt,
            status:status,
            order_date: new Date().getDate()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getFullYear(),
            order_time:new Date().getHours()+":"+new Date().getMinutes(),
            month:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
            year:new Date().getFullYear(),
            time:new Date().getTime()

          }
          db.get().collection(collection.ORDER_COLLECTIONS).insertOne(orderObj).then((response) => {
            product.forEach(element=>{
              let quantity=(0-element.quantity)
              db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectid(element.item)},{
                $inc:{stocks:quantity}
              })
            })
            db.get().collection(collection.CART_COLLECTIONS).deleteOne({user:objectid(order.userid)})
            resolve(response.insertedId)
          })
        })

      } ,
      getCartProductList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let cart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectid(userId)})
          resolve(cart.product)
        })
      },
      getUserOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let orders=await db.get().collection(collection.ORDER_COLLECTIONS)
          .find({userid:objectid(userId)})
          .sort({time:-1})
          .toArray()
          resolve(orders)
        })
      },
       getOrderProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
          let orderItems=await db.get().collection(collection.ORDER_COLLECTIONS)
          .aggregate([
            {
               $match:{_id:objectid(orderId)}
            },
            {
              $unwind:'$product'
            },
            {
              $project:{
                item:"$product.item",
                quantity:"$product.quantity",
                orderStatus:"$product.orderStatus"
            },              
            },
            {
              $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:"item",
                foreignField:"_id",
                as:'product',
              },
            },
            {
              $project:{
                item:1,
                quantity:1,
                orderStatus:1,
                product:{$arrayElemAt:['$product',0]}
              }
            }
          ]).toArray()
         resolve(orderItems)
        })
      },
      getOrderProducts:(orderId)=>{
          return new Promise(async(resolve,reject)=>{
            let orderItems=await db.get().collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                 $match:{_id:objectid(orderId)}
              },
              {
                $unwind:'$product'
              },
              {
                $project:{
                  item:"$product.item",
                  quantity:"$product.quantity",
                  orderStatus:"$product.orderStatus",
                  userid:1
              },              
              },
              {
                $lookup:{
                  from:collection.PRODUCT_COLLECTION,
                  localField:"item",
                  foreignField:"_id",
                  as:'product',
                },
              },
              {
                $project:{
                  item:1,
                  quantity:1,
                  orderStatus:1,
                  userid:1,
                  product:{$arrayElemAt:['$product',0]}
                }
              }
            ]).toArray()
            resolve(orderItems)
          })
        },
      deleteorder: (productId,orderId) => {
        return new Promise((resolve, reject) => {
          db.get()
            .collection(collection.ORDER_COLLECTIONS)
            .updateOne(
              {
                _id: objectid(orderId), "product.item" : objectid(productId)
              },
              {
                $set: {
                  "product.$.orderStatus":"Order Cancelled",
                },
              }
            )
            .then((response) => {
            resolve();
            });
        });
      },
      orderretun: (productId,orderId) => {
        return new Promise((resolve, reject) => {
          db.get()
            .collection(collection.ORDER_COLLECTIONS)
            .updateOne(
              {
                _id: objectid(orderId), "product.item" : objectid(productId)
              },
              {
                $set: {
                  "product.$.orderStatus":"Order Retuned",
                },
              }
            )
            .then((response) => {
            resolve();
            });
        });
      },
      getAllUserOrder:()=>{
          return new Promise (async(resolve,reject)=>{
              let orders=await db.get().collection(collection.ORDER_COLLECTIONS)
              .find()
              .sort({time:-1})
              .toArray()
              resolve(orders)
          })
      },
      changestatus:(data)=>{
        
        return new Promise((resolve, reject) => {
          db.get()
          .collection(collection.ORDER_COLLECTIONS)
          .updateOne(
            {
              _id: objectid(data.orderId), "product.item" : objectid(data.prodId)
            },
            {
              $set: {
                "product.$.orderStatus":data.status,
              },
            }
          )
          .then((response) => {
            
          resolve(response);
          });
        })
      },
      findProduct: (orderId, productId) => {
        return new Promise(async (resolve, reject) => {
          let product = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              { $match: { _id: objectid(orderId) } },
              {
                $unwind: "$product",
              },
              {
                $match: {
                  "product.item": objectid(productId),
                },
              },
              {
                $project: {
                  _id: 0,
                  Total: "$product.offstotal",
                  payment: 1,
                },
              },
            ])
            .toArray();
          resolve(product);
        });
      },
}
var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;

module.exports={
    getSalesReport: () => {
        try {
          return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              }
             ,
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
            ]).toArray()
          resolve(orders);
          });
          
        } catch (error) {
          console.log("404");
        }
      },
      getSalesReporttotal: () => {
        try {
          return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              },
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
              {
                $group:{
                  _id:null,
                  gtotal:{$sum: "$total" }
               }
              }
            ]).toArray()
          resolve(orders);
          });
          
        } catch (error) {
          console.log("404");
        }
      },
      fromTo: (dates) => {
        return new Promise(async (resolve, reject) => {
          if (dates.FromDate.trim().length === 0) {
            var from = new Date();
            from.setUTCHours(0, 0, 0, 0);
          } else {
            var from = new Date(dates.FromDate);
          }
          if (dates.ToDate.trim().length === 0) {
            var to = new Date();
            to.setUTCHours(0, 0, 0, 0);
          } else {
            var to = new Date(dates.ToDate);
          }
          let Data = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              },
              {
                $addFields: {
                  date: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
              },
              {
                $match: { date: { $gte: from, $lte: to } },
              },
              {
                $project: {
                  _id: 1,
                  userid: 1,
                  totalAmount: 1,
                  date: 1,
                  product: 1,
                  order_date: 1,
                },
              },
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
            ])
            .toArray();
          resolve(Data);
          });
        },
      salesdatetotal: (dates) => {
        return new Promise(async (resolve, reject) => {
          if (dates.FromDate.trim().length === 0) {
            var from = new Date();
            from.setUTCHours(0, 0, 0, 0);
          } else {
            var from = new Date(dates.FromDate);
          }
          if (dates.ToDate.trim().length === 0) {
            var to = new Date();
            to.setUTCHours(0, 0, 0, 0);
          } else {
            var to = new Date(dates.ToDate);
          }
          let Data = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              },
              {
                $addFields: {
                  date: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
              },
              {
                $match: { date: { $gte: from, $lte: to } },
              },
              {
                $project: {
                  _id: 1,
                  userid: 1,
                  totalAmount: '$totalAmount.total',
                  date: 1,
                  product: 1,
                  order_date: 1,
                },
              },
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
              {
                $group:{
                  _id:null,
                  gtotal:{$sum: "$total" }
               }
              }
            ])
            .toArray();
          resolve(Data);
          });
    },
    getSalesByMonth: (dateData) => {
      datamonth = parseInt(dateData.month);
      datayear = parseInt(dateData.year);
      return new Promise(async (resolve, reject) => {
        let orders = await db
          .get()
          .collection(collection.ORDER_COLLECTIONS)
          .aggregate([
            {
              $match: {
                status: "Success",
              },
            },
            {
              $addFields: {
                day: {
                  $dayOfMonth: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
                month: {
                  $month: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
                year: {
                  $year: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
              },
            },
            {
              $match: { month: datamonth, year: datayear },
            },
            {
              $unwind:"$product"
            },
            {
              $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
            },
            {
              $lookup:{
                from: collection.PRODUCT_COLLECTION,
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
              }
            },
            {
              $project: {
                quantity: 1,
                product: { $arrayElemAt : ["$productDetails",0]},
              },      
            },
            {
              $addFields:{
                total : {$multiply: ["$quantity","$product.offerprice"]}
              }   
            },
            {
              $project:{
                quantity:1,
                name:"$product.name",
                brand:"$product.brand",
                category:"$product.category",
                price:"$product.offerprice",
                total:1
              }
            },
          ])
          .toArray();
       resolve(orders)
        });
      },
    salesmonthlytotal: (dateData) => {
      datamonth = parseInt(dateData.month);
      datayear = parseInt(dateData.year);
      return new Promise(async (resolve, reject) => {
        let orders = await db
          .get()
          .collection(collection.ORDER_COLLECTIONS)
          .aggregate([
            {
              $match: {
                status: "Success",
              },
            },
            {
              $addFields: {
                day: {
                  $dayOfMonth: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
                month: {
                  $month: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
                year: {
                  $year: {
                    $dateFromString: {
                      dateString: "$order_date",
                    },
                  },
                },
              },
            },
            {
              $match: { month: datamonth, year: datayear },
            },
            {
              $unwind:"$product"
            },
            {
              $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
            },
            {
              $lookup:{
                from: collection.PRODUCT_COLLECTION,
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
              }
            },
            {
              $project: {
                quantity: 1,
                product: { $arrayElemAt : ["$productDetails",0]},
              },      
            },
            {
              $addFields:{
                total : {$multiply: ["$quantity","$product.offerprice"]}
              }   
            },
            {
              $project:{
                quantity:1,
                name:"$product.name",
                brand:"$product.brand",
                category:"$product.category",
                price:"$product.offerprice",
                total:1
              }
            },            
            {
              $group:{
                _id:null,
                gtotal:{$sum: "$total" }
             }
            }
          ])
          .toArray();
        resolve(orders)
        });
      },
      getSalesByyear: (datedata) => {
        datayear = parseInt(datedata.yearly);
        return new Promise(async (resolve, reject) => {
          let orders = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              },
              {
                $addFields: {
                  month: {
                    $month: {
                      $dateFromString: {
                        dateString: "$order_date",
                      },
                    },
                  },
                  year: {
                    $year: {
                      $dateFromString: {
                        dateString: "$order_date",
                      },
                    },
                  },
                },
              },
              {
                $match: { year: datayear },
              },
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
            ])
            .toArray();
          resolve(orders);
          });
        },
      salesyearlytotal: (dateData) => {
        datayear = parseInt(dateData.yearly);
        return new Promise(async (resolve, reject) => {
          let orders = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $match: {
                  status: "Success",
                },
              },
              {
                $addFields: {
                  month: {
                    $month: {
                      $dateFromString: {
                        dateString: "$order_date",
                      },
                    },
                  },
                  year: {
                    $year: {
                      $dateFromString: {
                        dateString: "$order_date",
                      },
                    },
                  },
                },
              },
              {
                $match: { year: datayear },
              },
              {
                $unwind:"$product"
              },
              {
                $group:{_id: "$product.item",quantity: {$sum: "$product.quantity"} }
              },
              {
                $lookup:{
                  from: collection.PRODUCT_COLLECTION,
                  localField: "_id",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $project: {
                  quantity: 1,
                  product: { $arrayElemAt : ["$productDetails",0]},
                },      
              },
              {
                $addFields:{
                  total : {$multiply: ["$quantity","$product.offerprice"]}
                }   
              },
              {
                $project:{
                  quantity:1,
                  name:"$product.name",
                  brand:"$product.brand",
                  category:"$product.category",
                  price:"$product.offerprice",
                  total:1
                }
              },
              {
                $group:{
                  _id:null,
                  gtotal:{$sum: "$total" }
               }
              }
            ])
            .toArray();
          resolve(orders);
          });
        },
      totalsaleAmount: () => {
        return new Promise(async (resolve, reject) => {
          let totalsale = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([{ $group: { _id: null, sum: { $sum: "$totalAmount.total" } } }])
            .toArray();
          resolve(totalsale);
        });
      },
      totalsales:()=>{
        return new Promise(async(resolve,reject)=>{
          let totalsales= await db.get().collection(collection.ORDER_COLLECTION).find(
            {
              status:"Success"
            }
          ).toArray()
          resolve(totalsales)
        })
      },
      totalcustomer:()=>{
        return new Promise(async(resolve,reject)=>{
          let customercount= await db.get().collection(collection.USERS_COLLECTION).find().toArray()
          resolve(customercount)
        })
      }
}
var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;
 
module.exports = {
    chartPayment:()=>{
        return new Promise(async(resolve, reject) => {
            chart=await 
            db.get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
                {
                    $group:{
                        _id:"$payment",
                        Total:{
                            $count:{},
                        }
                    }
                }
            ])
            .toArray()
            resolve(chart)
        })
    },sales: () => {
        return new Promise(async (resolve, reject) => {
          var graphDta = await db
            .get()
            .collection(collection.ORDER_COLLECTIONS)
            .aggregate([
              {
                $project: {
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
                $group: {
                  _id: {
                    // day: "$day",
                    month: "$month",
                    // year: "$year"
                  },
                  Total: {
                    $count: {},
                  },
                },
              },
            ])
            .toArray();
          resolve(graphDta);
        });
      }
    }

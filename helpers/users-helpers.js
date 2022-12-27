
var db = require("../configure/connection");

var collection = require("../configure/collections");

const bcrypt = require("bcrypt");

var objectid = require("mongodb").ObjectId;

module.exports = {
  addUsers: (users, callback) => {
    db.get()
      .collection("users")
      .insertOne(users)
      .then((data) => {
        callback(data);
      });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },

  getuserdetails: (userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: objectid(userid) })
        .then((user) => {
          resolve(user);
        });
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      let email = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ email: userData.email });
      if (email) {
        resolve(email);
      } else {
        let phone = await db
          .get()
          .collection(collection.USERS_COLLECTION)
          .findOne({ mobilenumber: userData.mobilenumber });
        if (phone) {
          resolve(phone);
        } else {
          
          userData.status = true;
          db.get()
            .collection(collection.USERS_COLLECTION)
            .insertOne(userData)
            .then((data) => {
              emptynewwall = {
                user: objectid(data.insertedId),
                Name: userData.fname,
                Amount: 0,
                history: []
              }
              
              db.get().collection(collection.WALLET_COLLECTION).insertOne(emptynewwall)
              resolve(data);
            });
        }
      }
    });
  },
  dologin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        if (user.blocked) {
          response.message = "blocked";
          resolve(response);
        } else {
          bcrypt.compare(userData.password, user.password).then((status) => {
            if (status) {
              response.user = user;
              response.status = true;
              resolve(user);
            } else {
              response.msg = true;
              response.status = false;
              resolve(response);
            }
          });
        }
      } else {
        resolve({ status: false });
      }
    });
  },
  updateUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          { _id: objectid(userId) },
          {
            $set: {
              blocked: true,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  unblockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          { _id: objectid(userId) },
          {
            $set: {
              blocked: false,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  updateUserProfile:(userId,users)=>{
    return new Promise((resolve, reject) => {
      db.get()
      .collection(collection.USERS_COLLECTION)
      .updateOne(
        {_id:objectid(userId)},
        {
          $set:{
            fname:users.fname,
            lname:users.lname,
            mobilenumber:users.mobilenumber,
            email:users.email
          }
        })
        .then((response) => {
          resolve();
        })
    })
  },upadateUserPassword: (userData, userId) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ _id: objectid(userId) });
      if (user) {
        bcrypt
          .compare(userData.password, user.password)
          .then(async (status) => {
            userData.newpassword = await bcrypt.hash(userData.newpassword, 10);
            if (status) {
              var data = await db
                .get()
                .collection(collection.USERS_COLLECTION)
                .updateOne(
                  { _id:objectid(userId) },
                  {
                    $set: { password: userData.newpassword },
                  }
                );
              resolve();
            } else {
              console.log("password wrong");
            }
          });
      }
    });
  },

  doOTP:(phone) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let userNum = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ mobilenumber: phone });
      if (userNum) {
        if (userNum.status) {
          response = userNum;
          response.status = true;
          resolve(response);
        } else {
          response.blockotp = true;
          resolve(response);
        }
      } else {
        response.status = false;
        resolve(response);
      }
    });
  }, 
  refundMoney: (details) => {
    return new Promise(async (resolve, reject) => {
      let price = await db
        .get()
        .collection(collection.ORDER_COLLECTIONS)
        .aggregate([
          { $match: { _id: objectid(details.order) } },
          {
            $unwind: "$products",
          },
          {
            $match: {
              "products.product": objectID(details.product),
            },
          },
          {
            $project: {
              _id: 0,
              Total: "$products.Total",
            },
          },
        ])
        .toArray();
      resolve(price[0].Total);
    });
  },
  getRefund: (data, price) => {
    return new Promise((resolve, reject) => {
      details = {
        From: "Refund",
        credited: price,
        Time: new Date(),
      };

      db.get()
        .collection(collection.WALLET_COLLECTION)
        .updateOne(
          { user: objectid(data.user) },
          { $inc: { Amount: parseInt(price) }, $push: { history: details } }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  getwallet:(userId)=>{
    return new Promise(async(resolve,reject)=>{
       let wallet =await db.get().collection(collection.WALLET_COLLECTION)
       .find({user:objectid(userId) })
       .sort({time:-1})
       .toArray()
       resolve(wallet)
        })
},
getwalletlist:(userId)=>{
  return new Promise(async(resolve, reject) => {
    let wallet=await db.get().collection(collection.WALLET_COLLECTION)
    .aggregate([
      { $match: { user: objectid(userId) } },
      { $unwind: "$history" },
      {
        $sort: { "history.Time": -1 },
      },
      {
        $match: { "history.From": "Refund" },
      },
    ]).toArray()
    resolve(wallet)
  })
}

};

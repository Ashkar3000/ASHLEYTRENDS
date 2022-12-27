var express = require("express");
var router = express.Router();
const usersHelpers = require("../helpers/users-helpers");
const productHelpers = require("../helpers/product-helpers");
const wishlistHelpers = require("../helpers/wishlist-helpers");
const ACCOUNTSID=process.env.ACCOUNTSID
const AUTHTOKEN=process.env.AUTHTOKEN
const SERVICEID= process.env.SERVICEID
require('dotenv').config()
const client = require("twilio")(ACCOUNTSID,AUTHTOKEN);

const {
  index,
  login,
  logout,
  userslogin,
  Puserslogin,
  signup,
  Psignup,
  logincancel,
  signupcancel,
  products,
  productDetails,
  cart,
  addtoCart,
  productQuantity,
  deleteItem,
  checkout,
  placeorder,
  orderSuccess,
  orders,
  OrderProducts,
  cancelOrder,
  Orderretun,
  verifypayment,
  addAddress,
  paddAddress,
  editAddress,
  peditAddress,
  deleteAddress,
  wishlist,
  addwishList,
  deletewish,
  userprofile,
  editprofile,
  updatepassword,
  useraddress,
  useraddaddress,
  userpaddaddress,
  usereditaddress,
  userpeditaddress,
  userwallets,
  couponCheck
}=require("../controllers/userControllers")

const{ 
  notVerifyUser,
  verifyUser
}=require("../middleware/userMiddlewarre");

/* GET users listing. */

router.route("/").get(index)

router.route("/login").get(login)

router.route("/logout").get(logout)

router .route("/userslogin").get(userslogin).post(Puserslogin)
 
router.route("/signup").get(signup).post(Psignup)

router.route("/signupcancel").get(signupcancel)

router.route("/logincancel").get(logincancel)

router
  .route("/otplogin")
  .get((req, res) => {
    otpmsg = req.session.otp
    res.render('users/otplogin', { otpmsg })
    req.session.otp = null
  },
  // (req, res, next) => {
  //   res.render("users/otplogin");
  // }
  )
  .post((req, res) => {
    usersHelpers.doOTP(req.body.mobilenumber).then((response) => {
      console.log(response);
      if (response.status) {
        req.session.mobile = req.body.mobilenumber
        
        client
          .verify
          .services(SERVICEID)
          .verifications
          .create({
            to: `+91${req.body.mobilenumber}`,
            channel: "sms"
          }).then((data) => {
            
            res.redirect('/otp')
          })
           
      } 
      // else {
      //   if (response.blockotp) {
      //     req.session.otp = "The Phone Number Is Blocked"
      //     res.redirect('/sendotp')
      //   } else {
      //     req.session.otp = "The Phone Number Is Not Registered"
      //     res.redirect('/sendotp')
      //   }
      // }
    })
  },
  //   (req, res, next) => {
  //   usersHelpers.otpcheak
  //   console.log(req.body.mobilenumber);
  //   client.verify
  //     .services(twilio.ServiceID)
  //     .verifications.create({
  //       to: `+91${req.body.mobilenumber}`,
  //       channel: "sms",
  //     })
  //     .then((data) => {
  //       req.session.phone = data.to;
  //       console.log("11111111111111111111");
  //       res.redirect("/otp");
  //     });
  // }
  );
router
  .route("/otp")
  .get((req, res, next) => {
    res.render("users/otp");
  })
  .post((req, res, next) => {
    usersHelpers.doOTP(req.session.mobile).then((response) => {
      console.log("++++++++++++++++++");
    console.log(req.session.mobile);
    var arr = Object.values(req.body);
    var otp = arr.toString().replaceAll(",", "");
    client.verify
      .services(SERVICEID)
      .verificationChecks.create({
        to: `+91${req.session.mobile}`,
        code: otp,
      })
      .then((data) => {
        console.log(response);
        if (data.valid) {
          console.log("----****---***--**-*");
          req.session.loggedIn = true;
          req.session.user = response
          console.log();       
          res.redirect("/");
        } else {
          req.session.otpfail = "Invalid otp";
          res.redirect("/otp");
        }
      });
  })
}
  );

router.route("/product").get(products)

router.route("/product-detail").get(notVerifyUser,productDetails)

router.route("/cart").get(notVerifyUser,cart)

router.route("/add-to-cart/:id").get(notVerifyUser,addtoCart)

router.route("/changeProductQuantity").post(notVerifyUser,productQuantity)

router.route("/delete/:id").get(notVerifyUser,deleteItem)

router.route('/checkout').get(notVerifyUser,checkout).post(notVerifyUser,placeorder)

router.route('/order-success').get(notVerifyUser,orderSuccess)

router.route('/orders').get(notVerifyUser,orders)

router.route('/viewOrderProducts').get(notVerifyUser,OrderProducts)

router.route("/cancelOrder").post(notVerifyUser,cancelOrder)

router.route("/Orderretun").post(notVerifyUser,Orderretun)

router.route("/verifyPayment").post(notVerifyUser,verifypayment)

router.route("/add-address").get(addAddress).post(notVerifyUser,paddAddress)

router.route("/edit-address").get(notVerifyUser,editAddress).post(notVerifyUser,peditAddress)

router.route("/delete-address").get(notVerifyUser,deleteAddress)

router.route("/wishlist").get(notVerifyUser,wishlist)

router.route("/addWishList/:id").get(notVerifyUser,addwishList)

router.route("/deleteWish/:id").get(notVerifyUser,deletewish)

router.route("/userprofile").get(notVerifyUser,userprofile).post(notVerifyUser,editprofile)

router.route("/updatepassword").post(notVerifyUser,updatepassword)

router.route("/useraddress").get(useraddress)

router.route("/useraddaddress").get(useraddaddress).post(notVerifyUser,userpaddaddress)

router.route("/usereditaddress").get(notVerifyUser,usereditaddress).post(notVerifyUser,userpeditaddress)

router.route("/userwallets").get(notVerifyUser,userwallets)

router.route("/couponCheck").post(couponCheck)


module.exports = router;
 

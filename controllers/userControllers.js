const razorPay = require("../helpers/razor-pay")
const usersHelpers = require("../helpers/users-helpers")
const productHelpers = require("../helpers/product-helpers")
const cartHelpers = require("../helpers/cart-helpers")
const orderHelpers = require("../helpers/order-helpers")
const addressHelpers = require("../helpers/address-helpers")
const wishlistHelpers = require("../helpers/wishlist-helpers")
const bannerHelpers = require("../helpers/banner-helpers")
const couponsHelpers = require("../helpers/coupons-helpers")


module.exports={

    index:async(req,res)=>{
    let user = req.session.user;
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    banner=await bannerHelpers.getAllBanners()
    productHelpers.getAllProducts().then((product) => {
      res.render("users/index", { user,product,cartCount,wishCount,banner});
    });
},

login:(req,res)=>{
    if (req.session.loggedIn) {
        res.redirect("/");
    }else{
        let msg = req.session.msg;
        res.render("users/userslogin", { msg });
        req.session.msg = null;
    }  
},

logout:(req,res)=>{
    req.session.loggedIn = null
    req.session.user = null;
    res.redirect("/");
},

userslogin:(req,res)=>{
    if (req.session.loggedIn) {
        res.redirect("/");
      } else {
        res.redirect("/userslogin");
    }    
},

Puserslogin:(req,res)=>{
usersHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response;
      res.redirect("/");
    } else if (response.message === "blocked") {
      
      res.redirect("/login");
    } else {
      res.redirect("/login");
    }
  });
},

signup:(req,res)=>{
    sgn = req.session.err;
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("users/userssignup", { sgn });
      req.session.err = null;
    }    
},

Psignup:(req,res)=>{
    usersHelpers.doSignup(req.body).then((response) => {
    if (response.email || response.phone) {
        req.session.err = "The email or Phone already exist";
        res.redirect("/signup");
    } else {
        res.redirect("/login");
    }
    });
},    

logincancel:(req,res)=>{
    res.redirect("/")
},

signupcancel:(req,res)=>{
    res.redirect("/login")
},

products:async(req,res)=>{
    let user=req.session.user    
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    productHelpers.getAllProductsshop().then((product) => {
        
    res.render("users/product",{user,cartCount,product,wishCount})
    });
    
},

productDetails:async(req,res)=>{
    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    productHelpers.getProductDetails(req.query.product).then((products) => {
        
    res.render("users/product-detail",{user,cartCount,products,wishCount})
    });
},

  cart:async(req,res)=>{
    let product=await cartHelpers.getCartProduct(req.session.user._id)
    if (product.status) {
    req.session.cartempty=product.status
    }
    let total =await cartHelpers.getTotalAmount(req.session.user._id)
    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    res.render("users/cart",{product,user:req.session.user._id,total,cartCount,user,err:req.session.cartempty,wishCount})
    req.session.cartempty=null      
},

addtoCart:(req,res)=>{
    cartHelpers.addToCart(req.params.id,req.session.user._id).then((resolve) => {
    res.json({status:true})
    })
},

productQuantity:(req,res)=>{
    cartHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response)
    })
},

deleteItem:(req,res)=>{
    cartHelpers.deleteitem(req.session.user._id, req.params.id).then(() => {
    res.redirect("/cart");
    })
  
},

checkout:async(req,res)=>{
    let user=req.session.user
    let total =await cartHelpers.getTotalAmount(req.session.user._id)
    let cartCount=null
    let address = await addressHelpers.getAllAddress(req.session.user._id)
    let coupons = await couponsHelpers.getAllCoupons(req.session.user._id)
    let wishCount=null
    let product=await cartHelpers.getCartProduct(req.session.user._id)
    console.log("1231313213211231233223213213213212313213213212312313232132132132123132131");
    console.log(product);
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    } 
    res.render('users/checkout',{user,total,cartCount,address,wishCount,coupons,product})
},

placeorder:async(req,res)=>{

    let products =await cartHelpers.getCartProductrOrder(req.body.userid)
    let totalPrice =await cartHelpers.getTotalAmount(req.body.userid)
    let address=await addressHelpers.getAddress(req.body.address)
    if (req.session.existcoupon) {
        couponsHelpers.insertCouponId(req.session.user._id,req.session.existcoupon)
    }
    orderHelpers.placeOrder(req.body,products,totalPrice,address).then(async(orderId) => {
        if (req.body['payment']==='COD') {
        res.json({COD_success:true})
        } else if(req.body['payment']==='Razor Pay'){
        razorPay.generaterRazorpay(orderId,totalPrice).then((response) => {
        res.json(response)  
        })
        }
        // else if (req.body['payment']==='Wallet') {
        //     console.log("wallet ");
        //     wallettotal = await couponsHelpers.findWalletTotal(req.session.user._id);
        //     console.log("uuuuu");
        //     console.log(wallettotal);
        //     if (wallettotal >= totalPrice) {
        //     couponsHelpers
        //     .walletPurchase(req.session.user._id,wallettotal)
        //     .then(() => {
              
        //         res.json({walletSucess:true});
            
        //     })
        // }
            
        // }
        //  else{
        // let orders=await paypal.getpaypalproducts(orderId)
        //     // console.log("1111111111111111111111");
        //     // console.log(orders);
        // let value = orders.reduce(function (accumulator, Value) {
        //     return accumulator + Value.price * Value.quantity;
        //   }, 0);
        //   req.session.total = value;
        //   console.log(req.session.total);
          
        //   paypal.paypalpayment(orders, value).then((payment) => {
        //     for (let i = 0; i < payment.links.length; i++) {
        //       if (payment.links[i].rel === "approval_url") {
        //         res.json(payment.links[i].href);
        //       }
        //     }
        //   })
        // }
    })
},

orderSuccess:(req,res)=>{
    res.render("users/order-success",{user:req.session.user})
},

orders:async(req,res)=>{
    let users=req.session.user
    let orders=await orderHelpers.getUserOrders(req.session.user._id)
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    res.render("users/orders",{users,user:req.session.user ,orders,cartCount,wishCount})
},

OrderProducts:async(req,res)=>{
    let users=req.session.user
    let orderId =  req.query.id;
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id) 
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let product=await orderHelpers.getOrderProducts(req.query.id)
    product.forEach((element) => {
        if (element.orderStatus == "Delivered") {
          element.delivered = true;
        } else if (element.orderStatus == "Order Retuned") {
          element.return = true;
        } else if (
          element.orderStatus == "Return Rejected" ||
          element.orderStatus == "Returned"||
          element.orderStatus=='Order Cancelled'
          )
           {
          element.none = true;
          
        }
        
    });
  

    res.render("users/viewOrderProducts",{user:req.session.user,product,orderId,cartCount,wishCount})
   
},

cancelOrder:(req,res)=>{
    let proId = req.body.prodId;
    let orderId = req.body.orderId
    let userId=req.session.user._id
    orderHelpers.deleteorder(proId,orderId).then(async(response) => {
        let product = await orderHelpers.findProduct(orderId,proId);
        if (product[0].payment !== "COD") {
                    data = {
                        user: req.body.userid,
                    };
                    usersHelpers.getRefund(data, product[0].Total);
                  }
                  res.json({status:true})
    })
},

Orderretun:(req,res)=>{
    let proId = req.body.prodId;
    let orderId = req.body.orderId
    let userId=req.session.user._id
    orderHelpers.orderretun(proId,orderId).then(async(response) => {
        let product = await orderHelpers.findProduct(orderId,proId);
        
        res.json({status:true})
    })
},

verifypayment:(req,res)=>{
    razorPay.verifyPayment(req.body).then(() => {
    razorPay.changePaymentStatus(req.body['order[receipt]']).then(() => {
    res.json({status:true})
    }).catch((err) => {
    res.json({status:false,errMsg:""})
    });
    })
},

addAddress:async(req,res)=>{
    console.log("lllllllllll");
    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
   
    res.render("users/add-address",{user,cartCount,wishCount})
},

paddAddress:(req,res)=>{

    addressHelpers.addAddress(req.body).then(() => {
        res.redirect('/checkout')
    })
},

editAddress:async(req,res)=>{

    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let address=await addressHelpers.getAddress(req.query.address)
    res.render("users/edit-address",{address,user,cartCount,wishCount})
},

peditAddress:(req,res)=>{
   
    addressHelpers.editAddress(req.query.address,req.body).then(() => {
    res.redirect('/checkout')
    })
},

deleteAddress:(req,res)=>{
    
    addressHelpers.deleteaddress(req.query.address).then(()=>{
    res.redirect('/checkout')
    })
},

wishlist:async(req,res)=>{
    let user=req.session.user
    let products=await wishlistHelpers.getWishList(req.session.user._id)
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    res.render("users/wishlist",{user,products,cartCount,wishCount})
},

addwishList:(req,res)=>{;
    wishlistHelpers.addWishlist(req.params.id,req.session.user._id).then((resolve) => {
       res.json({status:true}) 
    })
},

deletewish:(req,res)=>{

    wishlistHelpers.deleteWish(req.session.user._id,req.params.id).then(() => {
    res.redirect("/wishlist") 
    })
},

userprofile:async(req,res)=>{
    let user=req.session.user
    let products=await wishlistHelpers.getWishList(req.session.user._id)
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let users= await usersHelpers.getuserdetails(req.session.user._id)
    res.render("users/userprofile",{user,products,cartCount,wishCount,users})
},

editprofile:(req,res)=>{ 
    usersHelpers.updateUserProfile(req.session.user._id,req.body).then((result) => {
    
    res.redirect("/userprofile")
    })
},

updatepassword:(req,res)=>{
    userId=req.session.user._id
    usersHelpers.upadateUserPassword(req.body,userId).then(() => {

    res.redirect('/userprofile')
    })

},

useraddress:async(req,res)=>{
    let user=req.session.user
    let products=await wishlistHelpers.getWishList(req.session.user._id)
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let users= await usersHelpers.getuserdetails(req.session.user._id)
    let address = await addressHelpers.getAllAddress(req.session.user._id)
    res.render("users/useraddress",{user,products,cartCount,wishCount,users,address})
},

useraddaddress:async(req,res)=>{
    let user=req.session.user
    let products=await wishlistHelpers.getWishList(req.session.user._id)
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let users= await usersHelpers.getuserdetails(req.session.user._id)
   
    res.render('users/useraddaddress',{user,products,cartCount,wishCount,users,})
},

userpaddaddress:(req,res)=>{
    addressHelpers.addAddress(req.body).then(() => {
       
    res.redirect('/useraddress')
    })
},

usereditaddress:async(req,res)=>{
    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
    cartCount=await cartHelpers.getCartCount(req.session.user._id)
    wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let address=await addressHelpers.getAddress(req.query.address)
    res.render("users/edit-address",{address,user,cartCount,wishCount})
},

userpeditaddress:(req,res)=>{
    addressHelpers.editAddress(req.query.address,req.body).then(() => {
    res.redirect('/checkout')
    })
},
userwallets:async(req,res)=>{
    let user=req.session.user
    let cartCount=null
    let wishCount=null
    if (req.session.user) {
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await wishlistHelpers.getwishCount(req.session.user._id)
    }
    let users= await usersHelpers.getuserdetails(req.session.user._id)
    let wallet=await usersHelpers.getwallet(req.session.user._id)
    let walletlist=await usersHelpers.getwalletlist(req.session.user._id)
    
    res.render('users/userwallets',{user,cartCount,wishCount,users,wallet,walletlist})
   
},
couponCheck:async(req,res)=>{
    let total=req.body.total
    let applyCoupon=await couponsHelpers.getCoupon(req.body.couponcode,req.session.user._id,total)
    console.log(applyCoupon);
    if (applyCoupon.couponVerified) {
        
        let discountAmount = (total * parseInt(applyCoupon.percentage)) / 100;
        let couponAmount = total - discountAmount;
        applyCoupon.subtotal = Math.round(discountAmount);
        applyCoupon.amount = Math.round(couponAmount);
        req.session.existcoupon=applyCoupon._id
        res.json(applyCoupon);
      } else {
        res.json(applyCoupon);
      }
    
}
}
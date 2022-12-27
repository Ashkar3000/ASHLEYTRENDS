const { response } = require("express");

function addToCart(prodId,stocks) {
  if (stocks==0) {
    Swal.fire({
      icon:"error",
      title:"Oops.....",
      text:"out of stock"
    })
  } else {
    $.ajax({
      url: "/add-to-cart/" + prodId,
      method: "get",
      success: (response) => {
        if (response.status) {
          Swal.fire(
            'Good job!',
            'Item is add to cart',
            'success'
          ).then(() => {
            let count=$('#cart-count').html()
            count=parseInt(count)+1
            $('#cart-count').html(count)
  
            $("#badgeReload").load(window.location.href + " #badgeReload");
          })
        }else{
  
          location.href='/login'
        }
      },
    });
  }
}

function addWishlist(prodId) {
  //alert(prodId)
  $.ajax({
    url:"/addWishList/" + prodId,
    method:"get",
    success:(response)=>{


      location.reload()
    
    }
  })
}


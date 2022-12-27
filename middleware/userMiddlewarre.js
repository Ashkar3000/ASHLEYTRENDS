
const verifyUser = (req, res, next) => {
    if (req.session.userLogIn === true) {
      return res.redirect("/");
    }
    next();
  };
  
  const notVerifyUser = (req, res, next) => {
    if (req.session.loggedIn) {
       next()
    }
    else{
        res.redirect('/login')
    }
  };
  
  
  module.exports = {

    notVerifyUser,
    verifyUser
    
  }
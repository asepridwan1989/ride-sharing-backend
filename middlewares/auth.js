const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  let token = req.headers.token
  if(token){
    let verified = jwt.verify(token, process.env.TOKENKEY)
    if(verified){
      next()
    }else{
      res.status(403).json({
        message: 'unregistered user'
      })
    }
  }else{
    res.status(403).json({
      message: 'login first please'
    })
  }
}

const isAdmin = (req, res, next) => {
  let token = req.headers.token
  if (token) {
    let verified = jwt.verify(token, process.env.TOKENKEY)
    if(verified){
      if(verified.role == 'admin' || verified.role == 'firstadmin'){
        next()
      }else{
        res.status(403).json({
          message: 'You are not admin'
        })
      }
    }else{
      res.status(403).json({
        message: 'Unregistered user'
      })
    }
  } else {
    res.status(403).json({
      message: 'no one was logged in'
    })
  }
}

module.exports = {
  auth,
  isAdmin
}

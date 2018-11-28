const jwt = require('jsonwebtoken')

function getId(token){
  const verified = jwt.decode(token, process.env.TOKENKEY)
  if(!verified){
    res.status(403).json({
      message: 'you can not access this page, log in first'
    })
  }else{
    return verified.id
  }
}

module.exports = getId

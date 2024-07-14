const { verify } = require('crypto')
const createHttpError = require('http-errors')
const JWT= require('jsonwebtoken')
module.exports={
    getaccessToken: (userID)=>{
return new Promise((resolve, reject)=>{
    const payload={}
    const secretaccess= process.env.ACCESS_TOKEN_SECRET
    const options={
        expiresIn: '1h',
        issuer: 'pickurpage.com',
        audience: userID
    }
    JWT.sign(payload,secretaccess,options,(err,token)=>{
        if(err)
        {
            console.log(err)
            reject(createHttpError.InternalServerError())
            return
        }
       resolve(token)
    })
})
    },
    getrefreshtoken:(userID)=>{
        return new Promise((resolve, reject)=>{
            const payload={}
            const secretaccess= process.env.REFRESH_TOKEN_SECRET
            const options={
                expiresIn: '1h',
                issuer: 'pickurpage.com',
                audience: userID
            }
            JWT.sign(payload,secretaccess,options,(err,token)=>{
                if(err)
                {
                    console.log(err)
                    reject(createHttpError.InternalServerError())
                    return
                }
               resolve(token)
            })
        })
            },

    verifyToken: (req,res,next) => {
        if (!req.headers['authorization']) return next(createHttpError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
          if (err) {
            const message =
              err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(createHttpError.Unauthorized(message))
          }
          req.payload = payload
          next()
        })
      },
      VerifyRefreshToken:(refreshtoken)=>{
        return new Promise((resolve, reject)=>{
          JWT.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
            if (err) {console.log(err)
                return reject(createHttpError.Unauthorized())}
                const userId = payload.aud
            resolve(userId)
          })
        })
            },
}
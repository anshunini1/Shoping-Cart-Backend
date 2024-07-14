const createHttpError = require("http-errors")
const {authSchema}= require("../helpers/User_schema_validator")
const User = require("../Model/User.Model")
const client= require("../helpers/redis_start")
const {getaccessToken,getrefreshtoken,VerifyRefreshToken} = require("../helpers/jwttoken_generator")
module.exports={
    RegisterUser: async (req,res,next)=>{
      try { const validationresult= await authSchema.validateAsync(req.body)
        const logindetails = new User(validationresult)
        const savedUser = await logindetails.save()
        const accesstoken= await getaccessToken(savedUser.id)
        const refreshtoken= await getrefreshtoken(savedUser.id)
        await client.set(savedUser.id,refreshtoken)
        res.send({ accesstoken, refreshtoken })
      }
        catch(error)
        {
            if(error.isJoi==true) error.status=422
            next(error)
        }
    },
    LoginUserCheck: async (req,res,next)=>{
      try { const validationresult= await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: validationresult.email })
       if(!user) throw createHttpError.NotFound('User not registered')
        const passwordcheck = await  user.isvalidPassword(validationresult.password)
       if (!passwordcheck)
        throw createHttpError.Unauthorized('Username/password not valid')
       const accesstoken= await getaccessToken(user.id)
       const refreshtoken= await getrefreshtoken(user.id) 
       await client.set(user.id,refreshtoken)
       res.send({ accesstoken, refreshtoken })
      }
        catch(error)
        {
            if(error.isJoi==true)  return next(createHttpError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },
    LogoutUser: async (req,res,next)=>{
      try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createHttpError.BadRequest("Please add refreshToken key in the body ")
          const userid= await VerifyRefreshToken(refreshToken)
        console.log(userid)
       const user= await client.get(userid)
       if(!user)  throw createHttpError.BadRequest("not a valid refresh token")   
        if(user !== refreshToken) throw createHttpError.Unauthorized("not a valid refresh token")   
        await client.del(userid)
       res.sendStatus(204)
      }
        catch(error)
        {
            next(error)
        }
    },
    Refreshtoken: async (req,res,next)=>{
      try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createHttpError.BadRequest("Please add refreshToken key in the body ")
      const userid= await VerifyRefreshToken(refreshToken)
       const user= await client.get(userid)
       if(!user)  throw createHttpError.BadRequest("not a valid refresh token")   
        if(user !== refreshToken) {throw createHttpError.Unauthorized("not a valid refresh token")   }
        const accesstoken= await getaccessToken(userid)
       const refreshtoken= await getrefreshtoken(userid)
       await client.set(userid,refreshtoken)
       res.send({ accesstoken, refreshtoken })
      }
        catch(error)
        {
            next(error)
        }
    },
}
const mongoose = require("mongoose")
const  bcrypt = require('bcrypt')
const Shema= mongoose.Schema
const Userschema= new Shema({
    email: {
        type: String,
    required: true,
    lowercase: true,
    unique: true,
    },
    password:{
        type:String,
        require:true
    }
})
Userschema.pre('save',async function(next)
{
 try{   if(this.isNew)
    {
        const salt= await bcrypt.genSalt(10)
       const hashedpassword=  bcrypt.hash(this.password,salt)
this.password=hashedpassword
    }
    next()}
    catch(error)
    {
        next(error)
    }
})
Userschema.methods.isvalidPassword = async function(password){
    try{
      return  await bcrypt.compare(password,this.password)
    }catch (error) {
        throw error
      }
}
const User= mongoose.model('user',Userschema)
module.exports= User
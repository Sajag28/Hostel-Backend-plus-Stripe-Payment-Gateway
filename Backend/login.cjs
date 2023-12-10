const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const jwt_secret=crypto.randomBytes(32).toString('base64')
console.log("Generated Secret Key for Login: "+jwt_secret)
const login=async (username,password,database)=>{
    const result=await database.find({'id':username},{'password':password})
    console.log("This is the result")
    console.log(result)
    if(result.length!==0){
      var passcode=result[0].password;
      let verify=0
      if(password===passcode){
        verify=1;
      }
      else{
        verify=2
      }
      console.log("Value of verification "+verify)
      if(verify===1){
        var token=jwt.sign({'id':username},jwt_secret,{expiresIn:'1200s'});
        console.log("Created token "+token)
        return token;
      }
      else{
        var variable='0'
        return variable;
      }
    }
    else{
        var variable='0'
        return variable;
    }
}
module.exports={login}
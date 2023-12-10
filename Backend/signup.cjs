const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const secretKey = crypto.randomBytes(32).toString('base64');
console.log("Generated secret key:", secretKey);
const signup = async (database,name,password,id) => {
  const in_name = name;
  const pass=await bcrypt.hash(password,12);
  const iden = id

  // Check for existing user
  const outcome=await database.find({ 'id':id })
  console.log(outcome)
  if(outcome.length!==0) {
        console.error('User with ID already exists');
        var variable='0'
        return variable;
      }
  else{
      // Create and save new user
      const newUser = new database({
        name:in_name,
        id: iden,
        password:pass,
      });

      const s=await newUser.save()
      if(s) {
          console.log('Details saved successfully');
          var tk = jwt.sign({ id: newUser.id }, secretKey, { expiresIn: '1200s' })
          console.log("Token generated is: "+tk)
          return tk;
        }
      else {
          console.error(error);
          var vary='0'
          return vary;
        };
        
    }}
    


module.exports = { signup };
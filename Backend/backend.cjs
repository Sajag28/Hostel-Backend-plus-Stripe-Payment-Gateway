const {login} = require('./login.cjs');
const {signup} = require('./signup.cjs');
const { look, update, fill, deleteQ } = require('./Data.cjs');
const {mail}=require('./notification.cjs')
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser=require('body-parser')
const mongoose = require('mongoose');
const moment = require('moment');
app.use(bodyparser.json())
app.use(cors());
var token='0'
const credentialsPromise = mongoose.createConnection('mongodb://127.0.0.1:27017/?tls=false');
const stuRecordPromise = mongoose.createConnection('mongodb://127.0.0.1:27017/?tls=false');
      console.log('Both connections established');
      const schema1=new mongoose.Schema({
        name:{type:String,required:true},
        id:{type:String,required:true},
        password:{type:String,required:true},
      })
      const schema2=new mongoose.Schema({
        name:{ type:String, required:true},
        age:{ type:String, required:true},
        details:{
            reg:{ type:String, required:true},
            branch:{ type:String, required:true},
            cgpa:{ type:String, required:true},
            room:{ type:String, required:true},
            block:{ type:String, required:true},
            mess:{ type:String, required:true},
            fine:{type:Number, required:true},
            entry_night:{type:String,required:true},
            parentmailID:{type:String, required:true},
            studentmailID:{type:String, required:true},

        }
      })
      const cred=credentialsPromise.model('Credentials',schema1)
      const stu=stuRecordPromise.model('Student',schema2)
    

app.post('/put',async (req,res)=>{
    if(token!='0'){
    const name=req.body.name
    const age=req.body.age
    const reg=req.body.details.reg
    const branch=req.body.details.branch
    const cgpa=req.body.details.cgpa
    const room=req.body.details.room
    const block=req.body.details.block 
    const mess=req.body.details.mess
    const fine=req.body.details.fine  
    const entry=req.body.details.entry    
    const parentmailID=req.body.details.parentmailID 
    const studentmailID=req.body.details.studentmailID
    const output=await fill(name,age,reg,branch,cgpa,room,block,mess,fine,entry,parentmailID,studentmailID,stu)
    if(output){
        const m={
            "message":"success"
        }
        res.json(m)
    }
    else{
        const m={
            "message":"failed"
        }
        res.json(m)
    }}
    else{
      const m={
        "message":"Access Denied.Please re-login or signup"
      }
      res.json(m)
    }
})
app.post('/read',async (req,res)=>{
  if(token!='0'){
  const name=req.body.name 
  const reg=req.body.reg 
  const result=await look(name,reg,stu)
  if(result.length!=0){
    res.send(result)
  }
  else{
    const m={
      "message":"Nothing Found"
    }
    res.json(m)
  }
 }else{
  const m={
    "message":"Access Denied.Please re-login or signup"
  }
  res.json(m)
 }
})
app.post('/delete',async(req,res)=>{
  if(token!='0'){
  const reg=req.body.reg
  const del=await deleteQ(stu,reg)
  if(del===1){
    const m={
      "message":"Deletion Done"
    }
    res.json(m)
  }
  else{
    const m={
      "message":"Deletion Failed"
    }
    res.json(m)
  }
 }else{
  const m={
    "message":"Access Denied.Please re-login or signup"
  }
  res.json(m)
 }
})
app.post('/upd',async(req,res)=>{
  if(token!='0'){
  const reg=req.body.reg 
  const room=req.body.room 
  const mess=req.body.mess 
  const block=req.body.block
  const result=await update(stu,schema2,reg,room,mess,block)
  if(result===1){
    const m={
      "message":"Updation Successful"
    }
    res.json(m)
  }else{
    const m={
      "message":"Updation Failed"
    }
    res.json(m)
  }
}else{
  const m={
    "message":"Access Denied.Please re-login or signup"
  }
}
})
app.post('/signup1',async(req,res)=>{
   const name=req.body.name 
   const password=req.body.password 
   const id=req.body.id
   try{
   var sign=await signup(cred,name,password,id)
   token=sign
   console.log("Token becomes "+sign)
   if(token!='0'){
   setInterval(() => {
     const minute=0
     const decodedToken = jwt.decode(sign, { complete: true });
     const creationTime = decodedToken.payload.iat; // Get the creation time from the token
     const creationTimeMoment = moment.unix(creationTime); // Convert the creation time to a Moment object
     const minutesFromParticularMinute = creationTimeMoment.minute() - minute; // Get the minutes from the particular minute
     if(minutesFromParticularMinute>=20){
       token='0'
     }
   },20 * 60 * 1000)
   const m={
    "message":"Signup successful,Token generated for 20 min"
   }
   res.json(m)
  }else{
    const m={
      "message":"Data with this id already exists"
    }
    res.json(m)
  }
  }
  catch{
    const m={
      "message":"Signup Failed. Some big error occured"
    }
    res.json(m)
  }
})
app.post('/login',async (req,res)=>{
  const username=req.body.id 
  const password=req.body.password 
  var outcome=await login(username,password,cred);
  token=outcome
  if(token!=='0'){
    console.log("Succesful Login")
    console.log("Token becomes "+token)
    const m={
      "message":"Logged in Successfully for 20 mins"
    }
    res.json(m)
  }
  else{
    console.log("Login Failed")
    const m={
      "message":"Failed Login.Please Check the credentials"
    }
    res.json(m)
  }
})
app.get('/sendmail',async(req,res)=>{
  const outcome=await mail(stu)
  if(outcome===1){
    const m={
      "message":"Fine and entry check and sent mail accordingly"
    }
    res.json(m)
  }
  else{
    const m={
      "message":"Error in sending the mails"
    }
    res.json(m)
  }
})
app.get('/signout',(req,res)=>{
  token='0'
  console.log("Token is "+token)
  const m={
    "Token value":token
  }
  res.json(m)
})
app.listen(8000, () => {
  console.log('Server started at port 8000');
});

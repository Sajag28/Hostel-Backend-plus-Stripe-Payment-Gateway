const mongoose=require('mongoose')
const stuRecordPromise = mongoose.createConnection('mongodb://127.0.0.1:27017/?tls=false')
const fill=async (name,age,reg,branch,cgpa,room,block,mess,fine,entry,pmail,stmail,database)=>{
     console.log(name)
     console.log(reg)
     const check=await database.findOne({'details.reg':reg})
     if(check){
      console.log("Already there")
      
      return 0;
     }else{const student=new database({
        name:name,
        age:age,
        details:{
            reg:reg,
            branch:branch,
            cgpa:cgpa,
            room:room,
            block:block,
            mess:mess,
            fine:fine,
            entry_night:entry,
            parentmailID:pmail,
            studentmailID:stmail,
            

        }
     })
     const saved=await student.save()
      if(saved){
        console.log("Details saved successfully")
        
        return 1;
     }else{
        console.log(error)
        
        return 0;
     }

     
     }
}

const look=async (name,reg,database)=>{
  const search=await database.find({'name':name},{'details.reg':reg})
  if(search.length!='0'){
    console.log("Details Found")
    console.log(search)
    return search;
  }
  else{
    console.log("No Details Found")
    console.log(search)
    return search
  }
  
}

const update=async (database,schema,reg,room,mess,block)=>{
   const variable=stuRecordPromise.model('Student',schema)
   const verify=await database.find({'details.reg':reg})
   if(verify.length!='0'){
       const change=await variable.findOneAndUpdate({'details.reg':reg},{$set:{'details.room':room,'details.mess':mess,'details.block':block}})
       console.log("Updated successfully")
       console.log(change)
       return 1;
   }
   else{
      console.log("No data found")
      return 0;
   }
}
const deleteQ=async(database,reg)=>{
      const lk=await database.find({'details.reg':reg})
      console.log(lk)
      if(lk.length!='0'){
      const deleted=await database.findOneAndDelete({'details.reg':reg})
      console.log("Deletion Succesfull")
      return 1;
      }
      else{
         console.log("Nothing Such Found")
         return 0;
      }
      
    
}
module.exports={fill,look,update,deleteQ}
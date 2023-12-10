const nodemailer=require('nodemailer')
const mail=async (database)=>{
    const list=await database.find({})
    console.log("Student list is:\n"+list)
    try{
   
    const transport=nodemailer.createTransport({
        host:'smtp.ethereal.email',
        port:587,
        auth:{
            user:'anibal.yundt@ethereal.email',
            pass:'BPbbrBvb3fyJ4wM91w',
        },
    })
    list.map(async (elem)=>{
        var stname=elem.name 
        var regno=elem.details.reg 
        const finerate=elem.details.fine
        var entry=elem.details.entry_night
        var stID=elem.details.studentmailID 
        var pID=elem.details.parentmailID
        if(finerate!==0){
            if(pID){
         const mailOptions={
            from:'"Sajag Agrawal"<anibal.yundt@ethereal.email>',
            to:`${pID}`,
            subject:'Ward charged with fine',
            html:`<h2>
             Respected Parents,
             Your ward ${stname},Registration no ${regno} has been charged with a fine of Rs${finerate} for damaging the mens hostel property.
             We request you to look after this and pay the fine caused amount positively.
             Also for this attempt, your ward is subjected to ban for 2 weeks of campus outing and an appology letter to college autorities and hostel cheif warden as well. 
             Thanking you,
             XYZ University Mens Hostel Warden
             Home way from home
            </h2>`
         }
        
        const send=await transport.sendMail(mailOptions)
        console.log("Email to parents for fine sent successfully")
        
        }
    }else{
        console.log("No PID")
    }
        if(entry!=='YES'){
           if(pID&&stID){
           const mailalter={
              from:'"Sajag Agrawal"<anibal.yundt@ethereal.email>',
              to:`${pID}`,
              subject:`Entry for late night of ward not done`,
              html:`
              <h2>
               Respected Parents,
               This is to inform you that your ward ${stname}, Registration no.${regno} have not made the late night entry in the hostel yet.
               We request to please contact him asap for the same and look after his actions.
               XYZ University Mens Hostel Warden
               Home away from home
              </h2>`
           }
           const mailalter2={
             from:'"Sajag Agrawal"<anibal.yundt@ethereal.email>',
             to:`${stID}`,
             subject:'Hostel late night entry not done',
             html:`<h2>
              Dear ${stname}, please make the hostel night entry asap otherwise we have to put a fine on your account as per the hostel norms.
              XYZ University Mens Hostel Chief Warden
              Home away from home
             </h2>`
           }
           
             const mail1=await transport.sendMail(mailalter)
             
                console.log("Mail to parent for no entry sent successfully")
             
             const mail2=await transport.sendMail(mailalter2)
           
                console.log("Mail to student for no entry sent successfully ")
        }
        else{
            console.log("No PID or stID")
        }
             
             
           
        }})
        const response=1
        return response
    }
    

    catch{
      const response=0
      return response
    }
}
module.exports={mail}
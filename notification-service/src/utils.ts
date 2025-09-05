import emails from '@emailjs/nodejs'
export interface Payload{
    email:string,
    link:string;
    emailType:string;
}
export const sendMail=async(payload:Payload):Promise<boolean>=>
{
   try {
     if(payload.emailType=="VERIFY_ACCOUNT")
     {
      await emails.send(process.env.EMAILJS_SERVICE_ID as string,process.env.EMAILJS_VERIFY_ACCOUNT_TID as string,{
        email:payload.email,
        link:payload.link
       },{
        publicKey:process.env.EMAILJS_PUB_KEY as string,privateKey:process.env.EMAILJS_PRIVATE_KEY as string
       });
     }
     else{
          await emails.send(process.env.EMAILJS_SERVICE_ID as string,process.env.EMAILJS_RESET_PASSWORD_TID as string,{
        email:payload.email,
        link:payload.link
       },{
        publicKey:process.env.EMAILJS_PUB_KEY as string,privateKey:process.env.EMAILJS_PRIVATE_KEY as string
       });
     }
     console.log("success message send")
     return true
   } catch (error) {
    console.log(error)
    return false
   }

}
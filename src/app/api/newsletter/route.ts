export async function POST(request:Request){
  try{
    const origin=request.headers.get('origin');
    if(origin&&origin!==new URL(request.url).origin)return Response.json({message:'Please use the signup form on this website.'},{status:403});
    const text=await request.text();
    if(text.length>2048)return Response.json({message:'Please enter a valid email address.'},{status:400});
    let body;
    try{body=JSON.parse(text);}catch{return Response.json({message:'Please enter a valid email address.'},{status:400});}
    if(!body||typeof body!=='object')return Response.json({message:'Please enter a valid email address.'},{status:400});
    if(body.website)return Response.json({message:'Please leave the extra field empty.'},{status:400});
    const email=typeof body.email==='string'?body.email.trim():'';
    if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({message:'Please enter a valid email address.'},{status:400});
    const apiKey=process.env.MAILERLITE_API_KEY;
    const groupId=process.env.MAILERLITE_GROUP_ID;
    if(!apiKey||!groupId)return Response.json({message:'The reader list is temporarily unavailable. Please try again later.'},{status:503});
    const response=await fetch('https://connect.mailerlite.com/api/subscribers',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+apiKey},body:JSON.stringify({email,groups:[groupId]}),signal:AbortSignal.timeout(10000)});
    if(!response.ok)return Response.json({message:response.status===429?'Too many attempts. Please wait a little before trying again.':'We could not add your email. Please check it and try again.'},{status:response.status===429?429:502});
    return Response.json({message:'Thank you for joining the reader list. If a confirmation email arrives, follow its link to finish signing up.'});
  }catch{return Response.json({message:'We could not connect to the reader list. Please try again.'},{status:502});}
}

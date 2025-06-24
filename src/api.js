export async function CallApi(url,method = 'POST',data = null){
   // console.log(data);
   let token = localStorage.getItem('token');
   let options = {
    method,
    headers:{
         'Content-Type': 'application/json',
         'Authorization': `${token}`,
    }
   };
   if(data){
    options.body = JSON.stringify({data:data});
   }
   let res = await fetch(url,options);
   if (!res.ok) throw new Error('API request failed');
   return await res.json();
}

 export async function getUserinfo(token=localStorage.getItem('token')){
     const response = await fetch("/api/getuserinfo",{
      headers:{
         'Content-Type': 'application/json',
         'Authorization': `${token}`,
    }
     });  
     return response;
}
 export async function VerifyToken(pretoken){
   //let token = localStorage.getItem('token');
     const response = await fetch("/api/verifytoken",{
      headers:{
         'Content-Type': 'application/json',
         'Authorization': `${pretoken}`,
    }
     }); 
         return response;
}

 export async function setCookies(){
     const response = await fetch('/api/insureview',{
      headers:{
         'Content-Type': 'application/json',
         'Authorization': `${token}`,
    }

     }); 
   const result = response.json();

}

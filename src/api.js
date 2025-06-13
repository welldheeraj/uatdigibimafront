export async function CallApi(url,method = 'GET',data = null){
   let token = localStorage.getItem('token');
   let options = {
    method,
    headers:{
         'Content-Type': 'application/json',
         'Authorization': `${token}`,
    }
   };
   if(data){
    options.body = JSON.stringify(data);
   }
   let res = await fetch(url,options);
   if (!res.ok) throw new Error('API request failed');
   return await res.json();
}

 export async function getUserinfo(token){
//  let token = localStorage.getItem('token');
//  if(token){

     const response = await fetch("api/getuserinfo",{
      headers:{
         'Content-Type': 'application/json',
         'Authorization': `${token}`,
    }
     }); // Await the API call
    
   //   console.log(response);
     return response;
//  }
}
 export async function VerifyToken(pretoken){
     const response = await fetch("/api/verifytoken",{
      headers:{
         'Content-Type': 'application/json',
         'Authorization': `${pretoken}`,
    }
     }); 
         return response;
//  }
}


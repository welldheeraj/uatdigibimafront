export async function CallNextApi(url, methods, data = {}) {
  let options = {
    method:methods,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if(methods==='POST')
  {
    options.body = JSON.stringify(data);
  }
  let res = await fetch(url, options);
  if (!res.ok) throw new Error("API request failed");
  return await res.json();
}



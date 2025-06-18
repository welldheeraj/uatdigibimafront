import { useEffect,useState } from "react";
import { getCookie } from 'cookies-next';

// export async function getServerSideProps({ req, res }) {
//   const token = getCookie('token', { req, res });

//   return {
//     props: {
//       token: token || null,
//     },
//   };
// }

export default function Home() {
  const [token, setToken] = useState(null);

  useEffect(() => {
  async function setAndFetchToken() {
    await fetch("/api/setcookie");
    const res = await fetch("/api/getcookie");
    const data = await res.json();
    setToken(data.token);
    console.log(data);
  }

  setAndFetchToken();
}, []);

  return (
    <>
      <h1>Index Page</h1>
     <p>Token from cookie: {token ? JSON.stringify(token) : "No Token Yet"}</p>
    </>
  );
}


import '@/styles/globals.css';     
import '@/styles/css/digibima.css';  
import Header from './partial/header'
import Footer from './partial/footer'
// import CallApi from './callapi';
import { useState,useEffect } from "react";
export default function App({ Component, pageProps }) {
    const [token, setToken] = useState();

    useEffect(() => {
      setToken(localStorage.getItem("token"));
      // window.addEventListener("auth-token", () => {
      //   setToken(localStorage.getItem("token") || "");
      // });
    }, []);

  return (
    <>
    <Header token={token} setToken={setToken}/>
    {/* <CallApi/> */}
    <Component {...pageProps }  />
    <Footer/>
    </>
  );
}

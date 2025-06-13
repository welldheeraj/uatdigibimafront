
import '@/styles/globals.css';     
import '@/styles/css/digibima.css';  
import Header from './partial/header'
import Footer from './partial/footer'
// import CallApi from './callapi';
import { Toaster } from 'react-hot-toast';
import { useState,useEffect } from "react";
import { Crimson_Text } from 'next/font/google';
import { VerifyToken } from '../api';
import { useRouter } from "next/navigation";
import constant from "../env";
const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  const [stoken, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const syncToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(token);

    try {
      const res = await VerifyToken(token);
      const data = await res.json();

      if (!data.status) {
        localStorage.removeItem('token');
        setToken(null);
        router.push(constant.ROUTES.HEALTH.INDEX);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem('token');
      setToken(null);
      router.push(constant.ROUTES.HEALTH.INDEX);
    }
  };

  // Initial call
  syncToken();

  // Event listener for login/logout
  window.addEventListener('auth-change', syncToken);

  return () => window.removeEventListener('auth-change', syncToken);
}, []);

  return (
    <div className={crimson.className}>
      <Header token={stoken} setToken={setToken} />
      <Toaster />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

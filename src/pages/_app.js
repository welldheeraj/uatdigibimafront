// pages/_app.js

import "@/styles/globals.css";
import "@/styles/css/digibima.css";
import Header from "./partial/header";
import Footer from "./partial/footer";
import { Toaster } from "react-hot-toast";
import { useState, useEffect,React } from "react";
import { Crimson_Text } from "next/font/google";
import HealthInsuranceLoader from './health/loader';
import { useRouter } from "next/router"; 
import { VerifyToken } from "../api"; // Adjust import path if needed
import constant from "../env";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR errors

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setToken(null);
        setLoading(false);
        if (router.pathname !== constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        return;
      }
      try {
        const res = await VerifyToken(storedToken);
        const data = await res.json();

        if (data.status) {
          setToken(storedToken);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          if (router.pathname !== constant.ROUTES.HEALTH.INDEX) {
            router.push(constant.ROUTES.HEALTH.INDEX);
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setToken(null);
        if (router.pathname !== constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [router]);

  if (loading) return <div><HealthInsuranceLoader/></div>;

  return (
    <div className={crimson.className}>

        <Header token={token} setToken={setToken} />
        <Toaster />
        <Component {...pageProps} />
        <Footer />

    </div>
  );
}

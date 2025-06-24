// pages/_app.js

import "@/styles/globals.css";
import "@/styles/css/digibima.css";
import Header from "./partial/header";
import Footer from "./partial/footer";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, React } from "react";
import { Poppins } from "next/font/google";
import HealthInsuranceLoader from "./health/loader";
import { useRouter } from "next/router";
import { VerifyToken } from "../api"; // Adjust import path if needed
import constant from "../env";
import { CallApi, getUserinfo } from "../api";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // optional
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [cookie, setCookie] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const route = router.pathname;
  const splitRoute = route.trim().split("/");
  // console.log(router,splitRoute);
  const [Username, setUsername] = useState(null);
  const [userMobile, setUserMobile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR errors
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setToken(null);
        setLoading(false);

        if (router == constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        if (router == constant.ROUTES.MOTOR.INDEX) {
          router.push(constant.ROUTES.MOTOR.INDEX);
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
          if (router == constant.ROUTES.HEALTH.INDEX) {
            router.push(constant.ROUTES.HEALTH.INDEX);
          }
          if (router == constant.ROUTES.MOTOR.INDEX) {
            router.push(constant.ROUTES.MOTOR.INDEX);
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

  useEffect(() => {
    if (token) {
      // console.log("token:", token);

      const fetchData = async () => {
        
        try {
          setIsLoading(true);
          const response = await getUserinfo(token);
          const data = await response.json();
        console.log(data);
          if (data.status === true && data.user?.name) {
            setUserData(data.user);
            setUsername(data.user.name);
          } else {
            setUserData(null);
            setUsername(null);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUsername(null);
          setUserData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
    //console.log("uss", userData);
  }, [token, Username]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserinfo(token);
        const data = await response.json();

        if (data.status === true && data.user?.name) {
          setUserData(data.user);
          setUsername(data.user.name);
          //console.log("userData fetched:", data.user);
        } else {
          setUserData(null);
          setUsername(null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserData(null);
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className={poppins.className}>
      <Header
        token={token}
        setToken={setToken}
        username={Username}
        setUsername={setUsername}
      />

      {/* Conditional Rendering */}
      {loading ? (
        <div>
          <HealthInsuranceLoader />
        </div>
      ) : (
        <>
          <Toaster />
          <Component {...pageProps} usersData={userData} />
          <Footer />
        </>
      )}
    </div>
  );
}

// const responseSession = await fetch("/api/setsession", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ token: "456" }),
//         });
//         const sessionData = await responseSession.json();
//         console.log("Session Data:", sessionData);

//         // Fetch token data
//         const responseToken = await fetch("/api/getsession");
//         const tokenData = await responseToken.json();
//         console.log("Token Data:", tokenData);
// export async function getServerSideProps(context) {

//   return {
//     props: {
//       userinfo:'ffgfg'
//     },
//   };
// }

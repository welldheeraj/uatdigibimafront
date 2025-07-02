// pages/_app.js
// import '@mui/x-data-grid/index.css';
import "@/styles/globals.css";
import "@/styles/css/digibima.css";
import Header from "./partial/header";
import Footer from "./partial/footer";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, React } from "react";
import { Poppins } from "next/font/google";
import HealthInsuranceLoader from "./health/loader";
import { useRouter } from "next/router";
import { VerifyToken } from "../api";
import constant from "../env";
import { CallApi, getUserinfo } from "../api";
import { CallNextApi } from "./utils/helper";
import { PrimeReactProvider } from 'primereact/api';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // optional
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [authkey, setAuthkey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Username, setUsername] = useState(null);
  const [userMobile, setUserMobile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const route = router.pathname;
  const splitRoute = route.trim().split("/").filter(segment => segment !== "")[0];
  async function getSession() {
    let status = false;
    let tokenresponse = await CallNextApi("/api/getsession",
      "GET"
      );
    // tokenresponse= await tokenresponse.json();
    //setAuthkey(tokenresponse.authkey);
    if(tokenresponse.authkey && localStorage.getItem("token") && tokenresponse.authkey == localStorage.getItem("token") )
    {
      console.log('tkn',true);
      status=true;
    }
    else{console.log('tkn',false);
    }
    return status;
  }
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("token");
      // var storedCookie = await getSession();
      // console.log('gettokenresponse',storedCookie);
      if (!storedToken) {
        setToken(null);
        //setAuthkey(null);
        setLoading(false);
        if ('/' + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        if ('/' + splitRoute === constant.ROUTES.MOTOR.INDEX) {
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
          if ('/' + splitRoute === constant.ROUTES.HEALTH.INDEX) {
            router.push(constant.ROUTES.HEALTH.INDEX);
          }
          if ('/' + splitRoute === constant.ROUTES.MOTOR.INDEX) {
            router.push(constant.ROUTES.MOTOR.INDEX);
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setAuthkey(null);
        setToken(null);
        if ('/' + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        if ('/' + splitRoute === constant.ROUTES.MOTOR.INDEX) {
          router.push(constant.ROUTES.MOTOR.INDEX);
        }
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("token");
      //const updatedCookie = getSession().status ? getSession().authkey : null;
      setToken(updatedToken);
      //setAuthkey(updatedCookie);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    //console.log('session',authkey);
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUserinfo(token);
          const data = await response.json();
          //console.log('ghgh',data);
          if (data.status && data.user?.name) {
            setUserData(data.user);
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUserData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);
  // useEffect(() => {
  //   console.log('uuuatttu1', authkey,userData);
  // }, [userData,authkey])
  return (
    <div className={poppins.className}>
      <Header
        username={userData?.name}
        setUsername={setUserData}
      />

      {/* Conditional Rendering */}
      {loading ? (
        <div>
          <HealthInsuranceLoader />
        </div>
      ) : (
        <>
          < PrimeReactProvider />
          <Toaster />
          <Component {...pageProps} usersData={userData} token={token} />
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

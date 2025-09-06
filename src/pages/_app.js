// pages/_app.js
// import '@mui/x-data-grid/index.css';
import "@/styles/globals.css";
import "@/styles/css/digibima.css";
import Header from "./partial/header";
import Footer from "./partial/footer";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, React } from "react";
import { Poppins } from "next/font/google";
// import HealthInsuranceLoader from "./health/loader";
import CarInsuranceLoader, { BikeInsuranceLoader, HealthLoaderOne, DashboardLoader } from "@/components/loader";
import { useRouter } from "next/router";
import { VerifyToken } from "../api";
import constant from "../env";
import { CallApi, getUserinfo } from "../api";
import { PrimeReactProvider } from "primereact/api";
import { UserContext } from "@/context/UserContext";
import { showError } from "@/layouts/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // optional
  variable: "--font-poppins",
});

// Hoisted so it’s a stable reference (fixes the missing dependency warning)
  const PUBLIC_ROUTES = ["/","/login?type=health","/login?type=motor","/login/mainlogin","/adminpnlx"];

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [authkey, setAuthkey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [Username, setUsername] = useState(null);
  const [userMobile, setUserMobile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [kycData, setKycData] = useState({ status: null, kyctype: null });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const route = router.pathname;
  const isDashboard =
    router.pathname.startsWith("/userpnlx") ||
    router.pathname.startsWith("/adminpnlx") ||
    router.pathname.startsWith("/dashboard");

  const splitRoute = route
    .trim()
    .split("/")
    .filter((segment) => segment !== "")[0];

  async function getSession() {
    let status = false;

    //tokenresponse= await tokenresponse.json();
    console.log(
      "token",
      localStorage.getItem("token"),
      "cookie",
      tokenresponse
    );
    //setAuthkey(tokenresponse.authkey);
    // if(tokenresponse.authkey && localStorage.getItem("token") && tokenresponse.authkey == localStorage.getItem("token") )
    // {
    //   // console.log('tkn',true);
    //   status=true;
    // }
    // else{console.log('tkn',false);
    // }
    // return status;
  }

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("token");
      //svar storedCookie = await getSession();
      // console.log('gettokenresponse',storedCookie);
      if (!storedToken) {
        setToken(null);
        //setAuthkey(null);
        setLoading(false);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
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
          if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
            router.push(constant.ROUTES.HEALTH.INDEX);
          }
          if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
            router.push(constant.ROUTES.MOTOR.INDEX);
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setAuthkey(null);
        setToken(null);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          router.push(constant.ROUTES.HEALTH.INDEX);
        }
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
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
  }, [router, splitRoute]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const pathWithQuery = router.asPath; // this includes query params

      const isPublicRoute = PUBLIC_ROUTES.includes(pathWithQuery);

      if (!token && !isPublicRoute) {
        showError("You must be logged in to access this page.");
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, router.asPath]); // public routes are hoisted; no warning

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUserinfo(token);
          const data = await response.json();
          // console.log('ghgh',data);
          setKycData(data.kyctype, data.status);
          if (data.status && data.user?.name) {
            setUserData(data.user);
            setKycData({
              status: data.status,
              kyctype: data.kyctype, // example: 'p' or 'a'
            });
          } else {
            setUserData(null);
            setKycData({ status: false, kyctype: null });
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

  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => setPageLoading(false);
    const handleError = () => setPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  const renderLoader = () => {
    if (route.startsWith("/health")) return <HealthLoaderOne />;
      if (route.startsWith("/compare?type=health")) return <HealthLoaderOne />;
    if (route.startsWith("/motor")) return <CarInsuranceLoader />;
    if (route.startsWith("/compare?type=motor")) return <CarInsuranceLoader />;
    if (route.startsWith("/motor/bike")) return <BikeInsuranceLoader />;
    if (route.startsWith("/motor/car")) return <CarInsuranceLoader />;
    return <DashboardLoader />;
  };

  // useEffect(() => {
  //   // console.log('uuuatttu1', userData);
  // }, [userData]);

  return (
    <div className={poppins.className}>
      {!isDashboard && (
        <Header
          token={token}
          username={userData?.name}
          setUsername={setUserData}
        />
      )}

      {loading || pageLoading ? (
        renderLoader()
      ) : (
        <>
          <PrimeReactProvider />
          <Toaster />
          <UserContext.Provider value={{ userData, kycData, token }}>
            <Component {...pageProps} usersData={userData} kycData={kycData} token={token} />
          </UserContext.Provider>
          {!isDashboard && <Footer />}
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
//       abc:'ffgfg'
//     },
//   };
// }

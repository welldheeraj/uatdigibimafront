// pages/_app.js
// import '@mui/x-data-grid/index.css';
import "@/styles/globals.css";
import "@/styles/css/digibima.css";
import Header from "./partial/header";
import Footer from "./partial/footer";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, React } from "react";
import { Poppins } from "next/font/google";
import CarInsuranceLoader, {
  BikeInsuranceLoader,
  HealthLoaderOne,
  DashboardLoader,
} from "@/components/loader";
import { useRouter } from "next/router";
import { VerifyToken } from "../api";
import constant from "../env";
import { CallApi, getUserinfo } from "../api";
import { PrimeReactProvider } from "primereact/api";
import { UserContext } from "@/context/UserContext";
import { showError } from "@/layouts/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

// Hoisted so it’s a stable reference (fixes the missing dependency warning)
const PUBLIC_ROUTES = [
  "/",
  "/login?type=health",
  "/login?type=motor",
  "/login/mainlogin",
  "/adminpnlx",
];

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
  const [ingestDone, setIngestDone] = useState(false);

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

const { isReady, query, pathname, replace } = router;

useEffect(() => {
  if (!isReady) return;

  const {
    token: qToken,
    user_id,
    userid,
    id,
    uid,
    type: qType,
    login_type,
    user_name,
  } = query || {};
  console.log(query);

  const first = (v) => (Array.isArray(v) ? v[0] : v);

  const tokenFromQuery = first(qToken);
  const uidFromQuery =
    first(user_id) || first(userid) || first(id) || first(uid);
  const typeFromQuery = first(qType);
  const loginTypeFromQuery = first(login_type) || "user";
  const userNameFromQuery = first(user_name) || "";

  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  if (tokenFromQuery) {
    try {
      localStorage.setItem("token", tokenFromQuery);
      localStorage.setItem("logintype", loginTypeFromQuery);
      localStorage.setItem("username", userNameFromQuery);
      localStorage.setItem("userid", String(uidFromQuery || ""));
      localStorage.setItem("type", typeFromQuery || "customer");
    } catch {}

    setToken(tokenFromQuery);
    window.dispatchEvent(new Event("auth-change"));

    const t = norm(typeFromQuery);
    let targetPath = null;

    if (t === "health") {
      targetPath = "/health/common/insure";
    } else if (t.includes("2 wheeler") || t.includes("two wheeler")) {
      targetPath = "/motor/select-vehicle-type";
    } else if (t.includes("4 wheeler") || t.includes("four wheeler")) {
      targetPath = "/motor/select-vehicle-type";
    }

    const nav = targetPath
      ? replace(targetPath, undefined, { shallow: false })
      : replace(pathname, undefined, { shallow: true });

    nav.finally(() => setIngestDone(true));

    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("logintype"));
    console.log(localStorage.getItem("username"));
    console.log(localStorage.getItem("userid"));
    console.log(localStorage.getItem("type"));
    return;
  }

  // no token in query -> mark ingest done
  setIngestDone(true);
}, [isReady, query, pathname, replace]);





useEffect(() => {
  if (!isReady) return; 

  let ignore = false;

  const verifyAuth = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      if (!ignore) {
        setToken(null);
        setLoading(false);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          push(constant.ROUTES.HEALTH.INDEX);
        }
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
          push(constant.ROUTES.MOTOR.INDEX);
        }
      }
      return;
    }

    try {
      const res = await VerifyToken(storedToken);
      if (ignore) return;

      const data = await res.json();
      if (data.status) {
        setToken(storedToken);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          push(constant.ROUTES.HEALTH.INDEX);
        }
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
          push(constant.ROUTES.MOTOR.INDEX);
        }
      }
    } catch (error) {
      if (!ignore) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setAuthkey(null);
        setToken(null);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX) {
          push(constant.ROUTES.HEALTH.INDEX);
        }
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX) {
          push(constant.ROUTES.MOTOR.INDEX);
        }
      }
    } finally {
      if (!ignore) setLoading(false);
    }
  };

  verifyAuth();

  const handleAuthChange = () => {
    if (!ignore) {
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
    }
  };

  window.addEventListener("auth-change", handleAuthChange);

  return () => {
    ignore = true;
    window.removeEventListener("auth-change", handleAuthChange);
  };
}, [isReady, splitRoute]); 



  useEffect(() => {
   if (!router.isReady || !ingestDone) return; 

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const pathWithQuery = router.asPath;

      const isPublicRoute = PUBLIC_ROUTES.includes(pathWithQuery);

      if (!token ) {
        showError("You must be logged in to access this page.");
        router.push(constant.WEBSITEURL);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, router.isReady, ingestDone, router.asPath]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUserinfo(token);
          const data = await response.json();
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
            <Component
              {...pageProps}
              usersData={userData}
              kycData={kycData}
              token={token}
            />
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

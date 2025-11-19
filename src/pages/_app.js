// pages/_app.js
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
import { getUserinfo } from "../api";
import { PrimeReactProvider } from "primereact/api";
import { UserContext } from "@/context/UserContext";
import { showError } from "@/layouts/toaster";
import ErrorBoundary from "@/components/errorboundary";
// react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

// ✅ updated stable query client with best-practice defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      keepPreviousData: true,
    },
  },
});

// public routes
const PUBLIC_ROUTES = [
  "/",
  "/login?type=health",
  "/login?type=motor",
  "/login/mainlogin",
  "/adminpnlx",
];

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
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

  // verify token
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setToken(null);
        setLoading(false);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX)
          router.push(constant.ROUTES.HEALTH.INDEX);
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX)
          router.push(constant.ROUTES.MOTOR.INDEX);
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
          if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX)
            router.push(constant.ROUTES.HEALTH.INDEX);
          if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX)
            router.push(constant.ROUTES.MOTOR.INDEX);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setToken(null);
        if ("/" + splitRoute === constant.ROUTES.HEALTH.INDEX)
          router.push(constant.ROUTES.HEALTH.INDEX);
        if ("/" + splitRoute === constant.ROUTES.MOTOR.INDEX)
          router.push(constant.ROUTES.MOTOR.INDEX);
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
  }, [router, splitRoute]);

  // check auth for public routes
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const pathWithQuery = router.asPath;
      const isPublicRoute = PUBLIC_ROUTES.includes(pathWithQuery);
      if (!token && !isPublicRoute) {
        showError("You must be logged in to access this page.");
        router.push("/");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router, router.asPath]);

  // fetch user info
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getUserinfo(token);
          const data = await response.json();
          if (data.status && data.user?.name) {
            setUserData(data.user);
            setKycData({
              status: data.status,
              kyctype: data.kyctype,
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

  // loader during route change
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
        <QueryClientProvider client={queryClient}>
          <PrimeReactProvider>
            <Toaster />
            <UserContext.Provider value={{ userData, kycData, token }}>
              <ErrorBoundary>
                <Component
                  {...pageProps}
                  usersData={userData}
                  kycData={kycData}
                  token={token}
                />
              </ErrorBoundary>
            </UserContext.Provider>
            {!isDashboard && <Footer />}
          </PrimeReactProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      )}
    </div>
  );
}

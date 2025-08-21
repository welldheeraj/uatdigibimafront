"use client";

import { useEffect, useState } from "react";
import { showError } from "@/layouts/toaster";
import Sidebar from "./sidebar";
import TopBar from "./topbar";
import DashboardCards from "../pages/dashboard";
import ManagePlan from "../pages/manage-plan";
import ManageProduct from "../pages/manage-product";
import ManageUser from "../pages/manage-user";
import ManageVendor from "../pages/manage-vendor";
import { DashboardLoader } from "@/components/loader";
import { useRouter } from "next/router";
import { CallApi } from "@/api";
import constant from "@/env";

export default function DashboardPage({ usersData }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [admindata, setAdminData] = useState([]);
   const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  
  const publicRoutes = ["/adminpnlx"];

    useEffect(() => {
    const loginType = localStorage.getItem("logintype");
    if (loginType !== "admin") {
      showError("You must be logged in as admin to access the dashboard.");
      router.replace("/adminpnlx");
    } else {
      setIsAdminVerified(true); // allow second useEffect
    }
  }, []);


  // Fetch token from localStorage on initial load
   useEffect(() => {
    if (isAdminVerified) {
      const storedToken = localStorage.getItem("token");
      console.log(storedToken);
      setToken(storedToken);
    }
  }, [isAdminVerified]);

  // Fetch user data once the token is available
  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      try {
        const response = await CallApi(constant.API.ADMIN.ADMINLOGINDATA, "GET");
        if (response.status && response.data) {
          setAdminData(response.data); 
        }
      } catch (error) {
        console.error("❌ API Error:", error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      setActivePage(router.query.tab);
    }
  }, [router.isReady, router.query.tab]);

  // Show loader initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show loader on every activePage change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loader
    return () => clearTimeout(timer);
  }, [activePage]);



  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardCards admindata={admindata} token={token} />;
      case "manageplan":
        return <ManagePlan token={token} />;
      case "manageproduct":
        return <ManageProduct token={token} />;
      case "manageuser":
        return <ManageUser token={token} />;
      case "managevendor":
        return <ManageVendor token={token} />;
      default:
        return <p>Page Not Found</p>;
    }
  };

useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const path = router.pathname; // base path without query
    const isPublic = publicRoutes.some(publicRoute => path.startsWith(publicRoute));

    if (!token && !isPublic) {
      router.push("/adminpnlx");
      return;
    }

    setLoading(false);
  };

  checkAuth();
}, [router.pathname]);


  return (
    <>
      {loading ? (
        <DashboardLoader />
      ) : (
        <div className="flex h-screen bg-sky-100">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setActivePage={setActivePage}
            activePage={activePage}
            isMobileMenuOpen={isMobileMenuOpen}          
            setIsMobileMenuOpen={setIsMobileMenuOpen}    
          />
          <main className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white shadow">
              <TopBar 
                collapsed={collapsed}
                setActivePage={setActivePage} 
                admindata={admindata} 
                token={token}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                 isMobileMenuOpen={isMobileMenuOpen}
              />
            </div>
            <div className="p-6 mt-4">{renderPage()}</div>
          </main>
        </div>
      )}
    </>
  );
}

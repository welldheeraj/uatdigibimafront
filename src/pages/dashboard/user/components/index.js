import { useEffect, useState } from "react";
import Sidebar from "./sidbar";
import TopBar from "./topbar";
import DashboardCards from "../pages/dashboard";
import Claims from "../pages/claim";
import Policy from "../pages/policies";
import Profile from "../pages/profile";
import { DashboardLoader } from "@/components/loader";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const { userData, token } = useUser();
  console.log("User Data in Dashboard:", userData, token);

  // Query param  activePage update
  useEffect(() => {
    if (router.isReady && router.query.tab) {
      setActivePage(router.query.tab);
    }
  }, [router.isReady, router.query.tab]);

  // Loader for first time
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Loader on active page change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardCards />;
      case "claims":
        return <Claims />;
      case "policies":
        return <Policy />;
      case "profile":
        return <Profile />;
      default:
        return <p>Page Not Found</p>;
    }
  };

  return (
    <>
      {loading ? (
        <DashboardLoader />
      ) : (
        <div className="flex h-screen bg-sky-100">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
             setIsMobileMenuOpen={setIsMobileMenuOpen}
             isMobileMenuOpen={isMobileMenuOpen}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setActivePage={setActivePage}
            activePage={activePage}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white shadow">
              <TopBar
                collapsed={collapsed}
                setActivePage={setActivePage}
                 setIsMobileMenuOpen={setIsMobileMenuOpen}
                userData={userData}
              />
            </div>
            <div className="p-6 mt-4">{renderPage()}</div>
          </main>
        </div>
      )}
    </>
  );
}

"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/modal";
import {
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaPhoneAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";
import { CallApi } from "../../api";
import constant from "../../env";
import { useRouter } from "next/router";
import { showSuccess } from "@/layouts/toaster";
import Link from "next/link";
import { logo } from "@/images/Image";

export default function Header({ token, username, setUsername }) {
  const [localToken, setLocalToken] = useState(token || null);
  const [data, setData] = useState({ notifications: [], userName: null });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch notifications + username
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (localStorage.getItem("token")) {
        const res = await CallApi(constant.API.USER.NOTIFICATION, "GET");
        if (res?.status) {
          const notifications = Array.isArray(res?.notification)
            ? res.notification.map((n) => ({
                id: n.notificationId ?? n.id,
                message: n.message ?? "",
                time: n.time ?? "",
                vendor: n.vendor,
                type: n.type,
                read: Boolean(n.read ?? n.isRead ?? false),
                isRead: Boolean(n.isRead ?? n.read ?? false),
              }))
            : [];

          setData({
            notifications,
            userName:
              typeof res?.user === "string"
                ? res.user
                : res?.user?.name ?? null,
          });
        } else {
          setError("Failed to load notifications");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markNotificationsRead = async (notificationId = null) => {
    try {
      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          notificationId === null || n.id === notificationId
            ? { ...n, read: true, isRead: true }
            : n
        ),
      }));

      const payload =
        notificationId === null
          ? { notificationId: false }
          : { notificationId };

      const res = await CallApi(
        constant.API.USER.MARKNOTIFICATION,
        "POST",
        payload
      );

      if (!res?.status) {
        await fetchData();
        throw new Error(res?.message || "Failed to mark read");
      }
    } catch (err) {
      console.error("Error marking notifications:", err);
    }
  };

  const unreadCount = data.notifications.filter(
    (n) => !n?.isRead && !n?.read
  ).length;

  const logout = async () => {
    const response = await CallApi("/api/logout", "POST", "");
    if (response.status) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("logintype");

      setUsername("");
      setLocalToken(null);

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
      showSuccess(response.message);
    }
  };
  useEffect(() => {
    const syncAuth = () => {
      setLocalToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "");
    };

    window.addEventListener("auth-change", syncAuth);

    // initial run
    syncAuth();

    return () => {
      window.removeEventListener("auth-change", syncAuth);
    };
  }, [setUsername]);

  useEffect(() => {
    const updateAuth = (e) => {
      const detail = e?.detail ?? null;
      const tokenLocal = detail?.token ?? localStorage.getItem("token");
      const userName =
        detail?.username ?? localStorage.getItem("username") ?? null;

      if (tokenLocal) {
        setData((prev) => ({ ...prev, userName }));
        if (typeof setUsername === "function") setUsername(userName || "");
        fetchData();
      } else {
        setData((prev) => ({ ...prev, userName: "Guest", notifications: [] }));
        if (typeof setUsername === "function") setUsername("");
      }
    };

    updateAuth();
    window.addEventListener("auth-change", updateAuth);
    return () => window.removeEventListener("auth-change", updateAuth);
  }, [fetchData, setUsername]);

  return (
    <header className="w-full bg-[#C8EDFE]">
      <Modal
        isOpen={showNotificationModal}
        onClose={async () => {
          await markNotificationsRead(null);
          setShowNotificationModal(false);
        }}
        width="max-w-md"
        height="max-h-[70vh]"
        title="Notifications"
        confirmText="Mark all read"
        onConfirm={async () => {
          await markNotificationsRead(null);
          setShowNotificationModal(false);
        }}
      >
        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : data.notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
            {data.notifications.map((n, idx) => {
              const isUnread = !n?.read && !n?.isRead;
              return (
                <li
                  key={n.id ?? idx}
                  onClick={() => markNotificationsRead(n.id)}
                  className={`p-2 rounded bg-gray-50 flex justify-between items-center cursor-pointer ${
                    isUnread ? "hover:bg-gray-100" : "opacity-80"
                  }`}
                  title={isUnread ? "Mark as read" : "Already read"}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      markNotificationsRead(n.id);
                  }}
                >
                  <div className="text-sm font-medium">
                    {n.message}
                    {(n.vendor || n.type) && (
                      <div className="text-xs text-gray-400">
                        {[n.vendor, n.type].filter(Boolean).join(" • ")}
                      </div>
                    )}
                  </div>
                  <div className="relative flex items-center gap-6">
                    {isUnread && (
                      <span className="absolute -left-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {n.time}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>

      <div className="w-full bg-gradient-to-r from-[#28A7E4] to-[#4C609A] text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-xs" />
          <span>info@digibima.com</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-xs" />
          <span>+91 9119 173 733</span>
        </div>
      </div>

      <div className="bg-white px-6 py-4 mx-4 flex justify-between items-center rounded-bl-[40px] rounded-br-[40px] shadow-sm border-b relative">
        <Link href="/">
          <Image src={logo} alt="DigiBima Logo" className="h-[35px] w-auto" />
        </Link>

        <div className="relative flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={() => setShowNotificationModal(true)}
              className="w-10 h-10 rounded-full bg-[#C2EBFE] flex items-center justify-center shadow relative"
            >
              <FaBell className="text-purple-600 text-lg" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#CF5DCD] px-4 py-2 rounded-full text-white"
            >
              <FaUserCircle className="text-lg" />
              <span>Hi, {data.userName || "Guest"}</span>
              {isDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                <ul className="divide-y divide-gray-100 text-sm text-gray-700">
                  {!localToken ? (
                    <li
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/login/mainlogin");
                      }}
                      className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                    >
                      <FaUser className="text-blue-400 w-4 h-4" />
                      Login
                    </li>
                  ) : (
                    <>
                      <li
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push(constant.ROUTES.USER.PROFILE);
                        }}
                        className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                      >
                        <FaUser className="text-blue-400 w-4 h-4" />
                        Profile
                      </li>
                      <li
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="px-5 py-3 hover:bg-red-50 hover:text-red-600 transition-all duration-150 cursor-pointer font-medium flex items-center gap-2"
                      >
                        <FaSignOutAlt className="text-red-400 w-4 h-4" />
                        Logout
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

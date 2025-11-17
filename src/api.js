import { openDB } from "idb";
const DB_NAME = "DIGIBIMA";
const STORE_NAME = "digibima";
import constant from "@/env";

export async function CallApi(url, method = "POST", data = null) {
  let token = localStorage.getItem("token");
  //let userid = await getDBData("userid");
  // let token = await getDBToken("token");
  //  console.log( await getDBToken("token"));
  const deviceId = await getDeviceId();
  console.log("call api se phle device id", deviceId);
  //  return false;
  let options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Device-Id": deviceId,
    },
  };
  if (data) {
    options.body = JSON.stringify({ data: data });
  }
  let res = await fetch(url, options);
  if (!res.ok) throw new Error("API request failed");
  return await res.json();
}

export async function UploadDocument(url, method = "POST", file = null) {
  const token = localStorage.getItem("token");
  let options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: file,
  };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error("API request failed");
  return await res.json();
}

export async function getUserinfo(token = localStorage.getItem("token")) {
  const response = await fetch("/api/getuserinfo", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
export async function VerifyToken(pretoken) {
  let userid = await getDBData("userid");
  const response = await fetch("/api/verifytoken", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pretoken}`,
    },
    //body:{"userid":userid}
  });
  return response;
}

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function getDBData(key) {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function storeDBData(key, value) {
  const db = await getDB();
  await db.put(STORE_NAME, value, key);
}

export async function deleteDBData(key) {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}

export async function clearDBData() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
export async function isAuth() {
  return localStorage.getItem("token") ? true : false;
}
async function getDeviceId() {
  const raw = await getDBData("deviceid");

  // aapke case me value array ho sakti hai: ["1234567890"]
  return Array.isArray(raw) ? raw[0] : raw || null;
}

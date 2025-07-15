// import React from "react";
// import { getSession } from "next-auth/react";

// export default function ApiDataPage({ data }) {
//     console.log(data);
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-xl w-full bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold text-blue-700 mb-4">API Data</h1>
//         <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
//           {data.error ? data.error : JSON.stringify(data, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   try {
//     // Get the NextAuth session
//     const session = await getSession(context);
//     console.log(session);
//     if (!session?.token) {
//       // No token in session, maybe redirect to login or show error
//       return {
//         redirect: {
//           destination: "/",
//           permanent: false,
//         },
//       };
//     }

//     // Use the token from session to call your API
//     const res = await fetch("https://stage.digibima.com/api/getinsureinfo", {
//       headers: {
//         Authorization: `${session.token}`,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to fetch data");

//     const data = await res.json();

//     return {
//       props: { data },
//     };
//   } catch (error) {
//     return {
//       props: {
//         data: { error: error.message || "Failed to fetch data" },
//       },
//     };
//   }
// }

import { getToken } from "next-auth/jwt";
export default function ApiDataPage({ data }) {
    console.log(data);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">API Data</h1>
        <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
          {data.error ? data.error : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  const token = await getToken({ req: context.req });

  if (!token?.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch("https://stage.digibima.com/api/getinsureinfo", {
      headers: {
        Authorization: `${token.token}`, // secure server-side token
      },
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();

    return {
      props: { data },
    };
  } catch (error) {
    return {
      props: {
        data: { error: error.message || "Failed to fetch data" },
      },
    };
  }
}


import { useEffect, useState } from "react";
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/sessionconfig';

// export async function getServerSideProps(context) {
//   const session = await getIronSession(context.req, context.res, sessionOptions);

//   return {
//     props: {
//       token: session.token || null,
//     },
//   };
// }


export default function Home() {
  // console.log(token);
  return (
    <>
      <h1>Index Page</h1>
      <p>Token from session: {token ? JSON.stringify(token) : "No Token Yet"}</p>
    </>
  );
}

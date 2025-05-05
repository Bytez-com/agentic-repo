// import { Octokit } from "@octokit/rest";
// import { createAppAuth } from "@octokit/auth-app";
// import {
//   firestore,
//   collection,
//   getDocs,
//   query,
//   where,
//   update,
//   deleteField,
// } from "@/service/firebase/admin";

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const installation_id = Number(url.searchParams.get("installation_id"));
//     const state = url.searchParams.get("state");

//     const usersRef = collection(firestore, "users");

//     const querySnapshot = await getDocs(
//       query(usersRef, where("githubAppInstallState", "==", state))
//     );
//     const users = [];
//     querySnapshot.forEach((doc) => {
//       users.push({ id: doc.id, ...doc.data() });
//     });

//     const [user] = users;

//     const octokit = new Octokit({
//       authStrategy: createAppAuth,
//       auth: {
//         appId: process.env.GITHUB_APP_ID,
//         privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
//         installationId: installation_id,
//       },
//     });

//     const { data } = await octokit.request("GET /installation/repositories");

//     const [repoData] = data.repositories;

//     await update(`users/${user.id}`, {
//       installation_id,
//       repoData,
//       repo: repoData.html_url,
//       githubAppInstallState: deleteField(),
//     });

//     return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
//   } catch (error) {
//     console.error("Error fetching repositories:", error);

//     return new Response("Error fetching repositories", { status: 500 });
//   }
// }

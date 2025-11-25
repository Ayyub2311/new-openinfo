// // app/auth/session.ts
// import { cookies } from "next/headers";

// export type Session = { isAuthenticated: true; email?: string; pictureUrl?: string } | { isAuthenticated: false };

// function decodeJwtEmail(token: string | undefined): string | undefined {
//   if (!token) return;
//   try {
//     const [, payload] = token.split(".");
//     const json = JSON.parse(Buffer.from(payload, "base64").toString());
//     return json?.email as string | undefined;
//   } catch {
//     return;
//   }
// }

// export async function getSession(): Promise<Session> {
//   const token = (await cookies()).get("access_token")?.value;
//   if (!token) return { isAuthenticated: false };

//   const email = decodeJwtEmail(token);
//   return { isAuthenticated: true, email };
// }

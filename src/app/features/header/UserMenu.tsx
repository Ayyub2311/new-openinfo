// // app/shared/ui/UserMenu.tsx (Client Component)
// "use client";
// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";

// export default function UserMenu({ email, pictureUrl }: { email: string; pictureUrl?: string }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const onDoc = (e: MouseEvent) => {
//       if (!ref.current?.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDoc);
//     return () => document.removeEventListener("mousedown", onDoc);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(v => !v)}
//         className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
//         aria-haspopup="menu"
//         aria-expanded={open}
//       >
//         {pictureUrl ? (
//           <img src={pictureUrl} alt="" className="h-7 w-7 rounded-full" />
//         ) : (
//           <div className="h-7 w-7 rounded-full bg-violet-600 text-white grid place-items-center">
//             {email?.[0]?.toUpperCase() ?? "U"}
//           </div>
//         )}
//         <span className="hidden sm:block text-sm">{email}</span>
//         <svg width="16" height="16" viewBox="0 0 20 20" className="opacity-70">
//           <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
//         </svg>
//       </button>

//       {open && (
//         <div role="menu" className="absolute right-0 z-50 mt-2 w-44 rounded-xl border bg-white p-2 shadow-lg">
//           <a className="block rounded px-3 py-2 text-sm hover:bg-gray-50" href="/account">
//             Account
//           </a>
//           <a className="block rounded px-3 py-2 text-sm hover:bg-gray-50" href="/contact">
//             Contact Us
//           </a>
//           <a className="block rounded px-3 py-2 text-sm hover:bg-gray-50" href="/privacy">
//             Privacy
//           </a>
//           <a className="block rounded px-3 py-2 text-sm hover:bg-gray-50" href="/cookies">
//             Cookies
//           </a>
//           <form action="/api/auth/logout" method="post">
//             <button className="mt-1 block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50">Sign out</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

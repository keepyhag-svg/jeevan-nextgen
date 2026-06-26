import { auth } from "./auth" // Assuming you are using NextAuth v5 based on your auth.ts file

export default auth((req) => {
  // You can add custom auth logic here later if needed
});

// This config tells the middleware WHAT routes to protect.
export const config = {
  matcher: [
    // Ignore the homepage (/$), articles (/article/*), Sanity Studio (/studio/*), and Next.js internals
    "/((?!^/$|^/article/.*|^/studio/.*|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
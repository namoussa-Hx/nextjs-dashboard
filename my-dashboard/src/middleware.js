import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // optional: allow public paths
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: [
    /*
     * Protect ALL routes except Next.js internals and static files
     */
    "/((?!_next|.*\\..*).*)",
  ],
};




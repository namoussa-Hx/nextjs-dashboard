"use client";

import { useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // redirect safely AFTER auth is fully loaded
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/agencies");  // no freeze, no loop
    }
  }, [isSignedIn, router]);

  return (
    <>
      <SignedOut>
        <div className="center-wrapper">
          <div className="card">
            <div className="brand" aria-hidden>
                <svg
                className="brand-icon"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <rect x="7" y="8" width="3" height="3" fill="currentColor" />
                <rect x="14" y="8" width="3" height="3" fill="currentColor" />
                <rect x="7" y="13" width="3" height="3" fill="currentColor" />
                <rect x="14" y="13" width="3" height="3" fill="currentColor" />
              </svg>
            </div>

            <h1 className="title">Welcome to the Dashboard</h1>

            <p className="subtitle">
              Please sign in to access agencies and contacts.
            </p>

            <div className="btn-group">
              <SignInButton mode="modal">
                <button className="btn primary clerk-btn">
                  <img src="clerk-icone.png" className="clerk-icon" />
                  Continue with Clerk
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
      </SignedIn>
    </>
  );
}

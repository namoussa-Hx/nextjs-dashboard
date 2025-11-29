"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      {/* Left: single brand (svg + text) */}
      <div className="nav-left">
        <Link href="/" className="brand-badge" aria-label="Agency Connect home">
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

          <span className="logo">Agency Connect</span>
        </Link>
      </div>

      {/* Center: nav links */}
      <div className="nav-center">
        <Link
          href="/agencies"
          className={`nav-link ${pathname === "/agencies" ? "active" : ""}`}
        >
          Agencies
        </Link>

        <Link
          href="/contacts"
          className={`nav-link ${pathname === "/contacts" ? "active" : ""}`}
        >
          Contacts
        </Link>
      </div>

      {/* Right: auth */}
      <div className="nav-right">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="nav-btn">Sign In</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

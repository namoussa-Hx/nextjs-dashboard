"use client";

import Link from "next/link";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
       <nav className="navbar">
        <div className="nav-left">
          <span className="logo">NEXTJS-DASHBOARD</span>

          <Link href="/agencies" className="nav-link">Agencies</Link>
          <Link href="/contacts" className="nav-link">Contacts</Link>
        </div>

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




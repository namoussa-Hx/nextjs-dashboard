"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* NAVBAR */}
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

      {/* MAIN SECTION */}
      <div className="center-wrapper">
        <div className="card">
          <h1 className="title">Welcome to the Dashboard</h1>
          <p className="subtitle">
            Please sign in to access agencies and contacts.
          </p>

          <SignedOut>
            <div className="btn-group">
              <SignInButton mode="modal">
                <button className="btn primary">Sign In</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="btn secondary">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <p>You are already signed in!</p>
            <Link href="/agencies" className="enter-link">
              Go to Agencies →
            </Link>
          </SignedIn>
        </div>
      </div>
    </>
  );
}

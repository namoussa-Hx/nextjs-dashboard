"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="container">
      <h1>Welcome to the Dashboard</h1>

      <SignedOut>
        <p>Please sign in to access agencies and contacts.</p>

        <div className="btn-group">
          <SignInButton mode="modal">
            <button className="btn">Sign In</button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="btn">Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <p>You are already signed in!</p>
        <UserButton />
        <a href="/agencies" style={{ display: "block", marginTop: 20 }}>
          Go to Agencies →
        </a>
      </SignedIn>
    </div>
  );
}



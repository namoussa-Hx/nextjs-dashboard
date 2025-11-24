import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to the Dashboard</h1>

      <SignedOut>
        <p>Please sign in to access agencies and contacts.</p>
        <SignInButton mode="modal">
          <button style={{ marginRight: 10 }}>Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button>Sign Up</button>
        </SignUpButton>
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

"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
      <Link href="/agencies">Agencies</Link> |{" "}
      <Link href="/contacts">Contacts</Link>

      <div style={{ float: "right" }}>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in">Sign In</Link>
        </SignedOut>
      </div>
    </nav>
  );
}




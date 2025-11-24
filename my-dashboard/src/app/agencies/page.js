"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgencies() {
      const { data } = await supabaseBrowser
        .from("agencies")
        .select("*")
        .order("name", { ascending: true });

      setAgencies(data || []);
      setLoading(false);
    }

    loadAgencies();
  }, []);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        {loading ? (
          <p>Loading agencies...</p>
        ) : (
          <div style={{ padding: "20px" }}>
            <h1>Agencies</h1>
            <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>{agency.name}</td>
                    <td>{agency.city}</td>
                    <td>{agency.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SignedIn>
    </>
  );
}

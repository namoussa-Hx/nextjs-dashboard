"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    async function checkLimitAndLoad() {
      const today = new Date().toISOString().split("T")[0];

      // Check limit
      const { data: log } = await supabaseBrowser
        .from("view_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      // If log exists AND >= 50 → STOP
      if (log && log.contacts_viewed >= 50) {
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

      // Otherwise load contacts ❤️
      const { data, error } = await supabaseBrowser
        .from("contacts")
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          role,
          agencies(name, city)
        `);

      if (!error) {
        setContacts(data);

        // Update log
        if (!log) {
          await supabaseBrowser.from("view_logs").insert({
            user_id: user.id,
            date: today,
            contacts_viewed: data.length,
          });
        } else {
          await supabaseBrowser
            .from("view_logs")
            .update({
              contacts_viewed: log.contacts_viewed + data.length,
            })
            .eq("id", log.id);
        }
      }

      setLoading(false);
    }

    if (user) checkLimitAndLoad();
  }, [user]);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        {loading && <p>Loading contacts...</p>}

        {!loading && limitExceeded && (
          <div style={{ padding: 40 }}>
            <h2>You reached your daily contact view limit (50)</h2>
            <p>Upgrade your account to remove this limit.</p>
          </div>
        )}

        {!loading && !limitExceeded && (
          <div style={{ padding: "20px" }}>
            <h1>Contacts</h1>
            <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Agency</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.first_name} {c.last_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.role}</td>
                    <td>{c.agencies ? `${c.agencies.name} (${c.agencies.city})` : "—"}</td>
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

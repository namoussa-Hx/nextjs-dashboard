"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function ContactsPage() {
  const { user } = useUser();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Pagination
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  useEffect(() => {
    async function load() {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      // Get view_logs
      const { data: log } = await supabaseBrowser
        .from("view_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const alreadyViewed = log?.contacts_viewed || 0;

      // ✔ If user already reached 50, block immediately
      if (alreadyViewed >= 50) {
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

      const remaining = 50 - alreadyViewed;

      // Pagination slices
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Max index the user is allowed to see today (0–49)
      const maxIndexAllowed = alreadyViewed + remaining - 1;

      // ✔ User tries to go beyond last allowed page
      if (from > maxIndexAllowed) {
        setContacts([]);
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

      // Cap the end index at remaining
      const effectiveTo = Math.min(to, maxIndexAllowed);

      // Fetch actual slice
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
        `)
        .order("first_name")
        .range(from, effectiveTo);

      if (error) {
        console.error("Supabase error:", error);
        setContacts([]);
        setLoading(false);
        return;
      }

      setContacts(data || []);

      const newlyViewed = data.length; // number of newly viewed items

      // Update view_logs
      if (!log) {
        await supabaseBrowser
          .from("view_logs")
          .insert({
            user_id: user.id,
            date: today,
            contacts_viewed: newlyViewed,
          });
      } else {
        await supabaseBrowser
          .from("view_logs")
          .update({
            contacts_viewed: alreadyViewed + newlyViewed,
          })
          .eq("id", log.id);
      }

      // Calculate total pages the user can visit
      setMaxPages(Math.ceil(remaining / pageSize));

      setLoading(false);
    }

    load();
  }, [user, page]);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        {loading && <p>Loading contacts...</p>}

        {/* Limit Exceeded Page */}
        {!loading && limitExceeded && (
          <div className="container">
            <h2>You have reached your daily limit of 50 contacts.</h2>
            <p>Please come back tomorrow.</p>
          </div>
        )}

        {/* Normal Display */}
        {!loading && !limitExceeded && (
          <div className="container">
            <h1>Contacts</h1>

            <table className="table">
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
                    <td>{c.agencies?.name} ({c.agencies?.city})</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {maxPages}
              </span>

              <button
                className="btn"
                disabled={page >= maxPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </SignedIn>
    </>
  );
}

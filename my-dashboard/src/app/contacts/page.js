"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function ContactsPage() {
  const { user } = useUser();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    async function load() {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      // Load today's view log
      const { data: log } = await supabaseBrowser
        .from("view_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const alreadyViewed = log?.contacts_viewed || 0;

      // If user already viewed 50 today => block immediately
      if (alreadyViewed >= 50) {
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

      // Fetch only what the user is allowed to see
      const remaining = 50 - alreadyViewed;

      const { data } = await supabaseBrowser
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
        .limit(remaining);

      const fetchedContacts = data || [];
      setContacts(fetchedContacts);

      // Update view log (only increase by newly viewed count)
      if (!log) {
        await supabaseBrowser.from("view_logs").insert({
          user_id: user.id,
          date: today,
          contacts_viewed: fetchedContacts.length,
        });
      } else {
        await supabaseBrowser
          .from("view_logs")
          .update({
            contacts_viewed: alreadyViewed + fetchedContacts.length,
          })
          .eq("id", log.id);
      }

      setLoading(false);
    }

    load();
  }, [user]);

  // PAGINATION (works only on allowed contacts)
  const totalPages = Math.ceil(contacts.length / pageSize);
  const pageData = contacts.slice((page - 1) * pageSize, page * pageSize);

  // Handle Next click (custom for the limit message)
  const handleNext = () => {
    // If user tries to go beyond the last page => show limit message instantly
    if (page >= totalPages) {
      setLimitExceeded(true);
      return;
    }
    setPage(page + 1);
  };

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
            <h2>You reached your daily limit of 50 contacts.</h2>
            <p>Please upgrade to continue.</p>
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
                {pageData.map((c) => (
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

            {/* Pagination UI */}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                className="btn"
                onClick={handleNext}
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

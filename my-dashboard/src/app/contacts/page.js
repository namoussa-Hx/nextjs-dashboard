"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function ContactsPage() {
  const { user } = useUser();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    async function load() {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data: log } = await supabaseBrowser
        .from("view_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const alreadyViewed = log?.contacts_viewed || 0;

      if (alreadyViewed >= 50) {
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

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

      const fetched = data || [];
      setContacts(fetched);

      if (!log) {
        await supabaseBrowser.from("view_logs").insert({
          user_id: user.id,
          date: today,
          contacts_viewed: fetched.length,
        });
      } else {
        await supabaseBrowser
          .from("view_logs")
          .update({
            contacts_viewed: alreadyViewed + fetched.length,
          })
          .eq("id", log.id);
      }

      setLoading(false);
    }

    load();
  }, [user]);

  const totalPages = Math.ceil(contacts.length / pageSize);
  const pageData = contacts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>

        {loading && (
          <div className="container">
            <h1>Loading Contacts...</h1>
          </div>
        )}

        {!loading && limitExceeded && (
          <div className="container-limit">
            <h1>You reached your daily limit of 50 contacts.</h1>
            <p>Please upgrade to continue.</p>
          </div>
        )}

        {!loading && !limitExceeded && (
          <div className="container-contact">
            <h1>Contacts</h1>

            {/* FIX: WRAP TABLE */}
            <div className="table-wrapper-contact">
              <table className="table-contact">
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
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                &#8592;
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                &#8594;
              </button>
            </div>
          </div>
        )}

      </SignedIn>
    </>
  );
}

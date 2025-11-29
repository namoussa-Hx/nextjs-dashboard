"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20; // show 20 agencies per page

  useEffect(() => {
    async function loadAgencies() {
      const { data, error } = await supabaseBrowser
        .from("agencies")
        .select("*")
        .order("name", { ascending: true });

      if (!error) {
        setAgencies(data);
      }
      setLoading(false);
    }
    loadAgencies();
  }, []);

  const totalPages = Math.ceil(agencies.length / pageSize);
  const pageData = agencies.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <p>Loading agencies...</p>;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="container">
          <h1>Agencies</h1>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.city}</td>
                  <td>{a.address}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
      </SignedIn>
    </>
  );
}

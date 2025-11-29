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

  if (loading) return <div className="container"><h1>Loading agencies...</h1></div>;

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
                <th style={{ borderRadius: "8px 0px 0px 8px" }}>Name</th>
                <th>City</th>
                <th style={{ borderRadius: "0px 8px 8px 0px" }}>Address</th>
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
          <svg className="icon-arrow left" viewBox="0 0 320 512">
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 
            12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 
            118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 
            0l160 160z"/>
          </svg>
        </button>
          <span className="page-info">Page {page} of {totalPages}</span>
        <button
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          <svg className="icon-arrow" viewBox="0 0 320 512">
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 
            12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 
            118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 
            0l160 160z"/>
          </svg>
        </button>
        </div>
        </div>
      </SignedIn>
    </>
  );
}

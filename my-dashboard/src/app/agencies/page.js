"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgencies() {
      const { data, error } = await supabaseBrowser
        .from("agencies")
        .select("*")
        .order("name", { ascending: true });

      if (error) console.error("Error loading agencies:", error);
      setAgencies(data || []);
      setLoading(false);
    }

    loadAgencies();
  }, []);

  if (loading) return <p>Loading agencies...</p>;

  return (
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
  );
}

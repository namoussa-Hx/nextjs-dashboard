"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      const { data, error } = await supabaseBrowser
        .from("contacts")
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          role,
          agencies (
            name,
            city
          )
        `)
        .order("first_name", { ascending: true });

      if (error) {
        console.error("Error loading contacts:", error);
      } else {
        setContacts(data || []);
      }

      setLoading(false);
    }

    loadContacts();
  }, []);

  if (loading) return <p>Loading contacts...</p>;

  return (
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
  );
}

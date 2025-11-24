import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const supabase = supabaseServer();

  // Fetch today's record
  const { data, error } = await supabase
    .from("view_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    return Response.json({ error }, { status: 500 });
  }

  // If no record, create one
  if (!data) {
    await supabase.from("view_logs").insert({
      user_id: userId,
      date: today,
      contacts_viewed: 0,
    });

    return Response.json({ contacts_viewed: 0 });
  }

  return Response.json({ contacts_viewed: data.contacts_viewed });
}

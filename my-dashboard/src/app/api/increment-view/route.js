import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const supabase = supabaseServer();

  // Fetch today's record
  const { data } = await supabase
    .from("view_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (!data) {
    await supabase.from("view_logs").insert({
      user_id: userId,
      date: today,
      contacts_viewed: 1,
    });
    return Response.json({ contacts_viewed: 1 });
  }

  const newCount = data.contacts_viewed + 1;

  await supabase
    .from("view_logs")
    .update({ contacts_viewed: newCount })
    .eq("id", data.id);

  return Response.json({ contacts_viewed: newCount });
}

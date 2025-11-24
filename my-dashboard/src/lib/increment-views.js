import { supabaseBrowser } from "@/lib/supabase-browser";
import { currentUser } from "@clerk/nextjs";

export async function incrementViews() {
  const user = await currentUser();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  // Ensure today's log exists
  const { data, error } = await supabaseBrowser
    .from("view_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (!data) {
    await supabaseBrowser.from("view_logs").insert({
      user_id: user.id,
      date: today,
      contacts_viewed: 1,
    });
  } else {
    await supabaseBrowser
      .from("view_logs")
      .update({ contacts_viewed: data.contacts_viewed + 1 })
      .eq("id", data.id);
  }
}

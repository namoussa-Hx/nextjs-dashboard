import { supabaseBrowser } from "@/lib/supabase-browser";
import { currentUser } from "@clerk/nextjs";

export async function checkDailyLimit() {
  const user = await currentUser();
  if (!user) return { allowed: false, count: 0 };

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseBrowser
    .from("view_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    return { allowed: false, count: 0 };
  }

  // No record yet => user has 0 views today
  if (!data) {
    return { allowed: true, count: 0 };
  }

  return {
    allowed: data.contacts_viewed < 50,
    count: data.contacts_viewed,
  };
}

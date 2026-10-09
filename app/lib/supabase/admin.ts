
import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireAdmin() {
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!adminUserId) {
    throw new Error("ADMIN_USER_ID is not configured.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  if (user.id !== adminUserId) {
    redirect("/");
  }

  return user;
}

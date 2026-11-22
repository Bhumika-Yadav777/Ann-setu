
import { supabase } from "../../../services/supabaseClient";

// 1. Get all available food donations
export async function getAvailableDonations() {
  const { data, error } = await supabase
    .from("food_donations")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}


// 2. Get details of one donation
export async function getDonationById(id) {
  const { data, error } = await supabase
    .from("food_donations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}


// 3. Submit a food request
export async function createFoodRequest(donationId, message) {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please log in first.");
  }

  const { data, error } = await supabase
    .from("food_requests")
    .insert({
      donation_id: donationId,
      ngo_id: user.id,
      message: message,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}


// 4. Get requests made by the logged-in NGO
export async function getMyRequests() {
  const { data, error } = await supabase
    .from("food_requests")
    .select(`
      *,
      donation:food_donations!food_requests_donation_id_food_donations_fkey (
        food_name,
        category,
        quantity,
        quantity_unit,
        food_image_url,
        pickup_location
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}


// 5. Cancel a pending request
export async function cancelFoodRequest(requestId) {
  const { error } = await supabase
    .from("food_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) throw error;
}

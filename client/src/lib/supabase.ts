import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://pkwiqdvbkkseotkpugmr.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrd2lxZHZia2tzZW90a3B1Z21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Nzg1MzcsImV4cCI6MjA2MjE1NDUzN30.eOo2GFt7g5B9oeHCalmeCgPopF9twmR0IctrgFiBbps";

export const supabase = createClient(supabaseUrl, supabaseKey);

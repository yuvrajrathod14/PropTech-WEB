import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("properties")
    .update({ is_featured: false })
    .lt("feature_end_date", new Date().toISOString())
    .eq("is_featured", true);

  if (error) return new Response(error.message, { status: 500 });
  
  return new Response("Cron executed successfully", { status: 200 });
});

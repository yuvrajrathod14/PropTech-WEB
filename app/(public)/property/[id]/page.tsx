import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyDetailsClient } from "@/components/property/property-details-client";

interface PageProps {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("title, description")
    .eq("id", params.id)
    .single() as { data: { title: string; description: string } | null };

  if (!property) {
    return {
      title: "Property Not Found | PropTech",
    };
  }

  return {
    title: `${property.title} | PropTech`,
    description: property.description?.slice(0, 160) || "View property details on PropTech.",
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const supabase = createClient();
  
  // Fetch property data
  const { data: property, error } = await (supabase.from("properties") as any)
    .select(`
      id,
      title,
      price,
      type,
      description,
      images,
      amenities,
      created_at,
      view_count,
      city,
      locality,
      address,
      is_featured,
      beds,
      baths,
      area,
      bhk,
      carpet_area_sqft,
      furnishing,
      property_name:title,
      owner:owner_id (
        id,
        full_name,
        avatar_url,
        created_at,
        phone
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !property) {
    notFound();
  }

  // Check wishlist status if user is authenticated
  let initialIsWishlisted = false;
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    const { data: wishlistData } = await (supabase.from("wishlist") as any)
      .select("id")
      .eq("user_id", session.user.id)
      .eq("property_id", params.id)
      .maybeSingle();
    
    initialIsWishlisted = !!wishlistData;
  }

  return (
    <PropertyDetailsClient 
      property={property} 
      initialIsWishlisted={initialIsWishlisted} 
    />
  );
}

import { isFormPreview } from "@/lib/preview";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sponsorInquirySchema } from "@/lib/sponsor";
import { sendSponsorEmails } from "@/lib/email-send";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: a real user never fills the hidden `website` field. Silently
    // accept (so bots don't learn) but do nothing — no insert, no email.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json(
        { success: true, ...(isFormPreview ? { preview: true } : {}) },
        { status: 201 },
      );
    }

    const parsed = sponsorInquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    // Validate the preview exercise, without storing a record or contacting providers.
    if (isFormPreview) {
      return NextResponse.json(
        { success: true, preview: true, inquiry: null },
        { status: 201 },
      );
    }

    const data = parsed.data;

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from("de_sponsor_inquiries")
      .insert([
        {
          name: data.name,
          company: data.company || null,
          email: data.email.toLowerCase().trim(),
          phone: data.phone || null,
          interest: data.interest,
          budget: data.budget || null,
          message: data.message || null,
          consent_ip: ipAddress,
        },
      ])
      .select("id, name, email, created_at")
      .single();

    if (error) {
      console.error("Supabase sponsor insert error:", error);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 },
      );
    }

    // Inquirer confirmation + admin notice (lib/email-send: failures are
    // logged and swallowed, never break the inquiry).
    await sendSponsorEmails({
      name: data.name,
      company: data.company || null,
      email: data.email.toLowerCase().trim(),
      phone: data.phone || null,
      interest: data.interest,
      budget: data.budget || null,
      message: data.message || null,
    });

    return NextResponse.json(
      { success: true, inquiry: inserted },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sponsor inquiry API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

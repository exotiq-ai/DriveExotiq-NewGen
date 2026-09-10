import { recordGa4Lead } from "@/lib/ga4-server";
import { isFormPreview } from "@/lib/preview";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { waitlistSchema } from "@/lib/validations";
import { sendWaitlistEmails } from "@/lib/email-send";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot — silently drop bots (fake success).
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json(
        { success: true, ...(isFormPreview ? { preview: true } : {}) },
        { status: 201 },
      );
    }

    const parsed = waitlistSchema.safeParse(body);
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
        { success: true, preview: true, waitlist: null },
        { status: 201 },
      );
    }

    const data = parsed.data;

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from("de_waitlist")
      .insert([
        {
          email: data.email.toLowerCase().trim(),
          city: data.city || null,
          desired_car: data.desiredCar || null,
          source: "marketplace",
          consent_ip: ipAddress,
        },
      ])
      .select("id, email, created_at")
      .single();

    if (error) {
      // Unique violation (23505): the email is already on the list. Treat the
      // re-signup as idempotent success — same response as a fresh insert —
      // and return before any email so repeats never notify or confirm twice.
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("de_waitlist")
          .select("id, email, created_at")
          .eq("email", data.email.toLowerCase().trim())
          .maybeSingle();
        return NextResponse.json(
          { success: true, waitlist: existing },
          { status: 201 },
        );
      }
      console.error("Supabase waitlist insert error:", error);
      return NextResponse.json(
        { error: "Failed to join the waitlist" },
        { status: 500 },
      );
    }

    await recordGa4Lead(body.analytics, "waitlist");

    // Subscriber confirmation + admin notice (lib/email-send: failures are
    // logged and swallowed, never break the signup).
    await sendWaitlistEmails({
      email: data.email.toLowerCase().trim(),
      city: data.city || null,
      desired_car: data.desiredCar || null,
    });

    return NextResponse.json(
      { success: true, waitlist: inserted },
      { status: 201 },
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

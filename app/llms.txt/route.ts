import { isPreview, isFormPreview } from "@/lib/preview";
import { buildLlmsText } from "@/lib/llms";

export function GET() {
  return new Response(buildLlmsText(isPreview, isFormPreview), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

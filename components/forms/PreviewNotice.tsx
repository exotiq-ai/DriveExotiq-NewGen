import { isFormPreview } from "@/lib/preview";

export default function PreviewNotice() {
  if (!isFormPreview) return null;
  return (
    <p className="site-preview-note" role="note">
      <strong>Design preview.</strong> You can try this form. Submissions are
      not saved and no emails or texts are sent.
    </p>
  );
}

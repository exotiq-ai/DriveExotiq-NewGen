import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, id, "aria-describedby": ariaDescribedBy, ...props },
    ref,
  ) => {
    const errorId = error && id ? `${id}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full px-4 py-4 sm:py-3 bg-surface text-ink border rounded-sm resize-none text-base touch-manipulation",
            "focus:border-gulf transition-colors duration-250 ease-de",
            "placeholder:text-ink-3",
            error ? "border-papaya" : "border-line",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-2 text-sm text-papaya">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;

"use client";

import { Share2, Link as LinkIcon, Check, Send } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/components/ui/dialog";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ShareButtons({
  locale,
  title,
  articleUrl,
}: {
  locale: string;
  title: string;
  articleUrl?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useDialog();
  const isNp = locale === "np";

  const currentUrl =
    articleUrl || (typeof window !== "undefined" ? window.location.href : "");

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast(isNp ? "लिङ्क प्रतिलिपि भयो" : "Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(isNp ? "प्रतिलिपि असफल" : "Could not copy link", "error");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: currentUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink();
    }
  };

  const btn =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground";

  return (
    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {isNp ? "सेयर" : "Share"}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() =>
            openShare(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
            )
          }
          className={`${btn} hover:text-[#1877F2] hover:border-[#1877F2]/30`}
          title="Facebook"
          aria-label="Share on Facebook"
        >
          <FacebookIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            openShare(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`
            )
          }
          className={`${btn} hover:text-foreground`}
          title="X"
          aria-label="Share on X"
        >
          <XIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            openShare(
              `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`
            )
          }
          className={`${btn} hover:text-[#26A5E4] hover:border-[#26A5E4]/30`}
          title="Telegram"
          aria-label="Share on Telegram"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            openShare(
              `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${currentUrl}`)}`
            )
          }
          className={`${btn} hover:text-[#25D366] hover:border-[#25D366]/30`}
          title="WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNativeShare}
          className={btn}
          title={isNp ? "सेयर" : "Share"}
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className={btn}
          title={isNp ? "लिङ्क प्रतिलिपि" : "Copy link"}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

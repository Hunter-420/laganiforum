import Link from "next/link";
import {
  FacebookIcon,
  LinkedInIcon,
  MailIcon,
  XTwitterIcon,
} from "@/components/icons/social-icons";
import type { AuthorProfile } from "@/lib/types/author";

interface AuthorSocialLinksProps {
  author: AuthorProfile;
  className?: string;
}

const iconClass = "h-4 w-4";

export function AuthorSocialLinks({ author, className = "" }: AuthorSocialLinksProps) {
  const items: {
    key: string;
    href: string;
    label: string;
    external: boolean;
    Icon: typeof FacebookIcon;
  }[] = [];

  if (author.facebookUrl?.trim()) {
    items.push({
      key: "facebook",
      href: author.facebookUrl.trim(),
      label: "Facebook",
      external: true,
      Icon: FacebookIcon,
    });
  }
  if (author.linkedinUrl?.trim()) {
    items.push({
      key: "linkedin",
      href: author.linkedinUrl.trim(),
      label: "LinkedIn",
      external: true,
      Icon: LinkedInIcon,
    });
  }
  if (author.twitterUrl?.trim()) {
    items.push({
      key: "twitter",
      href: author.twitterUrl.trim(),
      label: "X (Twitter)",
      external: true,
      Icon: XTwitterIcon,
    });
  }
  if (author.email?.trim()) {
    items.push({
      key: "email",
      href: `mailto:${author.email.trim()}`,
      label: "Email",
      external: false,
      Icon: MailIcon,
    });
  }

  if (items.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} role="list">
      {items.map(({ key, href, label, external, Icon }) => (
        <li key={key}>
          <Link
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 dark:text-emerald-300 dark:hover:bg-emerald-950/50 dark:hover:border-emerald-800 transition-colors"
            aria-label={label}
            title={label}
          >
            <Icon className={iconClass} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

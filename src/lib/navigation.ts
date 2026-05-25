import { redirect } from "next/navigation";

/** Send visitors to locale home instead of a 404 when content is missing. */
export function redirectToLocaleHome(locale: string): never {
  const safe = locale === "np" ? "np" : "en";
  redirect(`/${safe}`);
}

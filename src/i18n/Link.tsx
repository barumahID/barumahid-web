"use client";

import NextLink from "next/link";
import { localizePath } from "./config";
import { useLang } from "./LangProvider";

// Pengganti next/link: alamat internal otomatis diberi awalan /en saat bahasa Inggris aktif.
export default function Link({ href, ...rest }: React.ComponentProps<typeof NextLink>) {
  const lang = useLang();
  return <NextLink href={typeof href === "string" ? localizePath(lang, href) : href} {...rest} />;
}

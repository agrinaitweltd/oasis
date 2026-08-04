"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Same logo used in the site header (/images/logo.png, falling back to the
// placeholder mark if it hasn't been uploaded yet) - used consistently across
// the auth/onboarding pages instead of the footer's white-on-dark variant.
const LOGO_DEFAULT = "/images/logo.png";
const LOGO_FALLBACK = "/images/oasis-logo.svg";

export function AuthLogo({ width = 140, height = 48, href = "/" }: { width?: number; height?: number; href?: string }) {
  const [error, setError] = useState(false);
  const src = error ? LOGO_FALLBACK : LOGO_DEFAULT;

  return (
    <Link href={href} style={{ display: "block", width, height }}>
      <Image
        key={src}
        src={src}
        alt="OASIS"
        width={width}
        height={height}
        unoptimized
        priority
        style={{ width, height, maxHeight: height, objectFit: "contain", objectPosition: "left center" }}
        onError={() => setError(true)}
      />
    </Link>
  );
}

// Animated gradient wordmark used on the auth card itself (alongside the
// icon logo in the branding panel), per the brand's slow-drifting purple
// gradient treatment: linear-gradient(90deg, #9498EF, #B59DFF).
export function AuthWordmark({ href = "/", fontSize = 22 }: { href?: string; fontSize?: number }) {
  return (
    <Link href={href} className="auth-wordmark" style={{ fontSize }}>
      OASIS
    </Link>
  );
}

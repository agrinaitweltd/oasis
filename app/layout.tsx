import type { Metadata } from "next";
import "@/styles/blocks.css";
import "@/styles/dashicons.css";
import "@/styles/globals.css";
import "@/styles/site.css";
import "@/styles/auth.css";

export const metadata: Metadata = {
  title: "OASIS | School Management System Uganda",
  description:
    "OASIS is Uganda's complete cloud-based school management system, built by Swivel Technologies for primary, secondary, international, nursery, vocational, faith-based, private and government schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-UG">
      <body className="wp-site-blocks wp-custom-logo wp-embed-responsive wp-theme-arbor mega-menu-max-mega-menu-1 block-theme">
        <a className="skip-link screen-reader-text" id="wp-skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

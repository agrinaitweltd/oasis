import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Arbor Education | School and Trust Management Information System",
  description:
    "Arbor is the UK's fastest growing school and trust management information system (MIS), used by thousands of schools and trusts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="wp-site-blocks">
        <a className="skip-link screen-reader-text" id="wp-skip-link" href="#wp--skip-link--target">
          Skip to content
        </a>
        <Header />
        <main id="wp--skip-link--target" className="wp-block-group is-layout-flow wp-block-group-is-layout-flow" style={{ marginTop: 0, marginBottom: 0 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

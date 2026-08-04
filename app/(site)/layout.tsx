import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="wp-block-group is-layout-flow wp-block-group-is-layout-flow" style={{ marginTop: 0, marginBottom: 0 }}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}

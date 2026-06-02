import "./globals.css";

import Header from "@/components/dashboard/TopHeader";
import FooterNav from "@/components/dashboard/BottomNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header  />

        <main className="pb-24">
          {children}
        </main>

        <FooterNav />
      </body>
    </html>
  );
}
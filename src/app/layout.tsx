import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/authContext";
import NavbarWrapper from "@/components/navbarWrapper";
import Footer from "@/components/layout/footer";
import "../app/globals.css";
import { PageTransitionProvider } from "@/providers/pageTransitionProvider";

export const metadata: Metadata = {
  title: "FormCoachAI - AI-Powered Workout Form Analysis",
  description:
    "Get real-time feedback on your exercise form using advanced AI technology. Train smarter, prevent injuries, and achieve your fitness goals with precision.",
  icons: {
    icon: "/img/logo.png", // Using your logo as the favicon
    apple: "/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <PageTransitionProvider>
            <NavbarWrapper />
            <main className="pt-16">{children}</main>
            <Footer />
          </PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

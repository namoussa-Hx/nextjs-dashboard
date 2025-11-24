import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Dashboard App",
  description: "Agencies + Contacts Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}


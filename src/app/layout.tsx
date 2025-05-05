import type { Metadata } from "next";

import Theme from "@/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme options={{ key: "joy" }}>{children}</Theme>
      </body>
    </html>
  );
}
export const metadata: Metadata = {
  title: "Agentic Repo",
  description: "Awaken your repo",
};

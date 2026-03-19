import "./globals.css";

export const metadata = {
  title: "Lighthouse - Editorial Assessment Tool",
  description: "An AI-powered editorial assessment tool for the newsroom.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

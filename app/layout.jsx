export const metadata = {
  title: "Ick Detector",
  description: "Find out if it's an ick — brutal honesty only.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

import "./styles.css";

export const metadata = {
  title: "Agyflow Next.js Staging Proof",
  description: "Next.js standalone runtime verification on cPanel Passenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

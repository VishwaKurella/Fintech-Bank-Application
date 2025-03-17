import "./globals.css";
export const metadata = {
  title: "VK",
  description: "Your Next Generation Banking Application",
  icons: {
    icon: "/bank_logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

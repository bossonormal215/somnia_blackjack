// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Providers } from "@/components/Providers";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Somnia Name Service",
//   description: "Decentralized naming service on Somnia",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fun BlackJack Game on Somnia",
  description:
    "Join the ultimate fun BlackJack game on Somnia - Where dreams meet the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <main className="min-h-screen bg-gray-900"> */}
        <Providers>{children}</Providers>
        {/* </main> */}
      </body>
    </html>
  );
}

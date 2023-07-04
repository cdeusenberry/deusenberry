import { ReactNode } from "react";

import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PokePicker!",
  description: "An app to pick the best pokemon for the situation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <h1 className="bg-green-500 p-4 text-xl">PokePicker!</h1>
        </div>
        {children}
      </body>
    </html>
  );
}

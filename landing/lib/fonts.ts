import localFont from "next/font/local";

/** Geist Sans variável: única fonte pré-carregada (é a do H1/LCP). */
export const geistSans = localFont({
  src: "../app/fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

/** Geist Mono só aparece em rótulos pequenos: sem preload para não competir com o LCP. */
export const geistMono = localFont({
  src: "../app/fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  preload: false,
});

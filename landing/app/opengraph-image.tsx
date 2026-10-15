import { ImageResponse } from "next/og";
import { hero, site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem Open Graph gerada no build — sem asset estático para manter. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(80% 70% at 50% 0%, rgba(59,130,246,0.35), #0A0A0A 70%)",
          backgroundColor: "#0A0A0A",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: -0.5, color: "#A3A3A3" }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, letterSpacing: -3, lineHeight: 1.02 }}>
          {hero.headline.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8A8A8F" }}>Margem por cliente · Previsão de caixa · Alertas de risco</div>
      </div>
    ),
    size,
  );
}

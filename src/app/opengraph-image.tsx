import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "Boulevard Automóviles, automotora en Uruguay";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0a0a0a 0%, #172B67 58%, #D32F2F 100%)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 84% 18%, rgba(255,255,255,0.22) 0, transparent 28%), radial-gradient(circle at 20% 88%, rgba(211,47,47,0.42) 0, transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -130,
            display: "flex",
            width: 560,
            height: 560,
            borderRadius: 999,
            border: "34px solid rgba(255,255,255,0.13)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "68px 76px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 126,
                height: 126,
                borderRadius: 28,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
              }}
            >
              <div style={{ display: "flex", color: "#D32F2F", fontSize: 78, fontWeight: 900, lineHeight: 1 }}>B</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 900, letterSpacing: -2 }}>Boulevard Automóviles</div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 29, fontWeight: 800, color: "rgba(255,255,255,0.82)" }}>
                Automotora en Uruguay
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.3 }}>
              Venta de autos, permutas y financiación bancaria.
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {["Autos seleccionados", "Test drive", "Atención directa", "+20 años"].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    padding: "12px 18px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", fontSize: 27, fontWeight: 900 }}>{siteConfig.streetAddress}, {siteConfig.location}</div>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.78)" }}>{siteConfig.businessHours}</div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "16px 24px",
                borderRadius: 999,
                background: "white",
                color: "#172B67",
                fontSize: 30,
                fontWeight: 900,
                boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              }}
            >
              {siteConfig.primaryPhoneDisplay}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

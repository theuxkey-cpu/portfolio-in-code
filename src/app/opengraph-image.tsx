import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "Keythe Rueckert - Product Designer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const profileData = await readFile(join(process.cwd(), "public/profile.png"), "base64")
  const profileSrc = `data:image/png;base64,${profileData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 28,
          padding: "0 96px",
          background: "#1a1510",
          color: "#f5efe6",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profileSrc}
          width={140}
          height={140}
          alt=""
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -1.5, display: "flex" }}>
            Hi, I&apos;m <span style={{ color: "#c9a876", marginLeft: 18 }}>Keythe</span>.
          </div>
          <div style={{ fontSize: 30, color: "#b8ab98", display: "flex" }}>
            Product Designer who builds in code, prototyping product interfaces in React
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f2f3f3", color: "#16191f", fontFamily: "Arial, sans-serif" }}>
        <main style={{ width: "min(100% - 2rem, 32rem)", padding: "2rem", border: "1px solid #d5dbdb", borderRadius: "0.5rem", background: "white" }}>
          <h1 style={{ marginTop: 0, fontSize: "1.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#5f6b7a", lineHeight: 1.5 }}>The page couldn’t be loaded. Try again.</p>
          <button onClick={() => reset()} style={{ padding: "0.6rem 1rem", border: 0, borderRadius: "0.25rem", background: "#0972d3", color: "white", fontWeight: 600, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  );
}

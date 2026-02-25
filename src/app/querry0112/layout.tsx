export default function QueryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Kill the global pre-loader for this route */}
      <style>{`
        #pre-loader {
          display: none !important;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "white",
          color: "black",
          padding: 20,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </>
  );
}
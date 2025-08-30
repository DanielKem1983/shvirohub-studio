import Layout from "../../components/Layout";
import dynamic from "next/dynamic";

// путь на 2 уровня вверх от pages/workbench/index.tsx до src/components/SideChat.tsx
const SideChat = dynamic(() => import("../../components/SideChat"), { ssr: false });

export default function WorkbenchPage() {
  return (
    <Layout title="Workbench">
      <div style={{ display: "flex", height: "80vh", gap: 16 }}>
        <div style={{ flex: 1, borderRight: "1px solid #ccc" }}>
          <SideChat />
        </div>
        <div style={{ flex: 2, padding: "1rem" }}>
          <h2>Предпросмотр</h2>
          <iframe src="/" style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
      </div>
    </Layout>
  );
}
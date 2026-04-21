import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <section className="content wide">
      <div className="content-inner" style={{ maxWidth: 1100 }}>
        <Dashboard />
      </div>
    </section>
  );
}

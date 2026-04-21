import Link from "next/link";
import { TopicNav } from "./TopicNav";
import { SearchBar } from "./SearchBar";

export function Topbar() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">📚 Vefforitun Exam</Link>
      <TopicNav />
      <SearchBar />
    </header>
  );
}

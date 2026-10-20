import { useEffect, useState } from "react";

const links = [
  { href: "#meja", id: "meja", label: "Meja" },
  { href: "#bayar", id: "bayar", label: "Bayar" },
  { href: "#story", id: "story", label: "Story" },
];

export default function Header() {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="topbar">
      <a className="brand" href="#atas" aria-label="Paduka by Tabusi, kembali ke atas">
        <img src="/logo.png" alt="" width="950" height="373" />
      </a>
      <nav className="nav" aria-label="Utama">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={current === link.id ? "is-current" : undefined}
            aria-current={current === link.id ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const sectionLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `rounded-md px-3 py-2 text-sm border transition-colors ${
      isActive
        ? "bg-[#181e29] text-white font-bold"
        : "border-transparent text-gray-700 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="modern-theme min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3">
          <div
            className="mr-4 text-lg font-semibold text-gray-900"
          >
            miro.io
          </div>
          <Link
            href="/nav"
            className={sectionLinkClassName("/nav")}
          >
            About Me
          </Link>
          <Link
            href="/nav/experience"
            className={sectionLinkClassName("/nav/experience")}
          >
            Experience
          </Link>
          <Link
            href="/nav/contact"
            className={sectionLinkClassName("/nav/contact")}
          >
            Contact Me
          </Link>
          <div className="ml-auto">
            <Link
              href="/"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back to Island Adventure
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div>{children}</div>
      </main>
    </div>
  );
}

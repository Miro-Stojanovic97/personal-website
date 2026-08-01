import Link from "next/link";

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="modern-theme min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3">
          <Link
            href="/nav/" className="mr-4 text-lg font-semibold text-gray-900"
          >
            miro.io
          </Link>
          <Link
            href="/nav/about"
            className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            prefetch={true}
          >
            About Me
          </Link>
          <Link
            href="/nav/experience"
            className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            prefetch={true}
          >
            Experience
          </Link>
          <Link
            href="/nav/contact"
            className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            prefetch={true}
          >
            Contact Me
          </Link>
          <div className="ml-auto">
            <Link
              href="/"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              prefetch={true}
            >
              Back to Island Adventure
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
          <div>{children}</div>
          <aside className="w-full">
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/95 text-center text-sm text-gray-500">
              Professional
              <br />
              Photo Placeholder
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

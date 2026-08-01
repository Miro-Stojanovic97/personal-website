"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

export default function AppTransitionShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isModernRoute = pathname.startsWith("/nav");

  if (isModernRoute) {
    return <>{children}</>;
  }

  return <ViewTransition name="page-transition">{children}</ViewTransition>;
}

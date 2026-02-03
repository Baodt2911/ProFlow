import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export const Layout = AppLayout;

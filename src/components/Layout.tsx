import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Layout({
  title = "ShviroHub",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${title} | ShviroHub`}</title>
      </Head>

      <nav style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
        <Link href="/">Главная</Link>{" | "}
        <Link href="/projects">Projects</Link>{" | "}
        <Link href="/integrations">Integrations</Link>{" | "}
        <Link href="/repo">Repo</Link>{" | "}
        <Link href="/qa">QA</Link>{" | "}
        <Link href="/history">History</Link>{" | "}
        <Link href="/workbench">Workbench</Link>
      </nav>

      <main style={{ padding: 16 }}>{children}</main>
    </>
  );
}
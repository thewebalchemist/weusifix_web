import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="text-gray-800 bg-stone-100 dark:text-gray-300 dark:bg-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

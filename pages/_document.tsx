import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <body className="text-gray-800 bg-stone-100 dark:text-gray-300 dark:bg-black">
        <Main />
        <NextScript />
        <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/65a25a008d261e1b5f52cdf9/1hk12v5bf';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
              `,
            }}
          />
      </body>
    </Html>
  );
}
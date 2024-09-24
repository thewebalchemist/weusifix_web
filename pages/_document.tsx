import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
            <title>Weusifix | Whatever You Need is Here</title>
            <meta name="description" content="Whatever You Need is Here" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="keywords" content="" />
            <meta property="og:title" content="Weusifix" />
            <meta property="og:description" content="Whatever You Need is Here" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="/images/weusi-light.png" />
            <meta property="og:url" content="/images/weusi-light.png" />
            <link rel="canonical" href="https://weusifix.com" />
      </Head>
      <body className="text-gray-800 bg-stone-100 dark:text-gray-300 dark:bg-gray-800">
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
                s1.src='https://embed.tawk.to/66e333e0ea492f34bc129946/1i7jo5a0j';
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

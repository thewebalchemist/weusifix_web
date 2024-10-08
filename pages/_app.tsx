import type { AppProps } from 'next/app';
import Layout from './Layout';
import '../styles/globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast'
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>Weusifix | Whatever You Need is Here</title>
          <meta name="description" content="Whatever You Need is Here" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="" />
          <meta property="og:title" content="Weusifix" />
          <meta property="og:description" content="Whatever You Need is Here" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/images/weusi-light.png" />
          <meta property="og:url" content="https://weusifix.com" />
          <link rel="canonical" href="https://weusifix.com" />
        </Head>
        <Toaster position="top-center" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
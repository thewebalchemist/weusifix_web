import type { AppProps } from 'next/app';
import Layout from './Layout';
import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import { app } from '../lib/firebase';
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
    <ThemeProvider>
    <Toaster position="top-center" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
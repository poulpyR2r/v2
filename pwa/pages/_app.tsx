import "../styles/globals.css";
import Layout from "../components/common/Layout";
import Head from "next/head";
import type { AppProps } from "next/app";
import type { DehydratedState } from "react-query";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>My awesome PWA app</title>
        <meta name="description" content="Best PWA app in the world!" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />=
      </Head>
      <Layout dehydratedState={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;

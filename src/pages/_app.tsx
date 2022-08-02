import Head from 'next/head';
import type { AppProps } from 'next/app';

import '../firebase';
import { wrapper } from '../store';

import './globals.scss';

const image = 'https://grouphub.app/og-image.png';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=0,viewport-fit=cover"
        />
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Black.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Bold.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Thin.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Light.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-Medium.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Metropolis-SemiBold.ttf"
          as="font"
          crossOrigin=""
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no,address=no" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* <title>GroupHub</title> */}

        <meta itemProp="name" content="GroupHub" />
        <meta itemProp="image" content={image} />

        <meta property="og:url" content="https://grouphub.app" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:title" content="GroupHub" />
        <meta property="og:site_name" content="GroupHub" /> */}
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:title" content="GroupHub" /> */}
        <meta name="twitter:image" content={image} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(MyApp);

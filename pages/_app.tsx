import "bootstrap/dist/css/bootstrap.min.css";
import App from "next/app";
import Head from "next/head";
import React from "react";
import { GalleryContextProvider } from "../components/Contexts/GalleryContext";
import { UserContextProvider } from "../components/Contexts/UserContext";

class MoodieApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <UserContextProvider>
        <GalleryContextProvider>
          <Head>
            <title>Moodie</title>
          </Head>
          <Component {...pageProps} />
        </GalleryContextProvider>
      </UserContextProvider>
    );
  }
}

export default MoodieApp;

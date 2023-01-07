import { Timeline } from "@/components/Timeline";
import { type NextPage } from "next";
import Head from "next/head";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hello</title>
        <meta name="description" content="Social media" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Timeline />
      </div>
    </>
  );
};

export default HomePage;

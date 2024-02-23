import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/articles/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Articles</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;

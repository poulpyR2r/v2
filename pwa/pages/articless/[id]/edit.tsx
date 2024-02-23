import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/articles/Form";
import { PagedCollection } from "../../../types/collection";
import { Articles } from "../../../types/Articles";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getArticles = async (id: string | string[] | undefined) =>
  id ? await fetch<Articles>(`/articles/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: articles } = {} } = useQuery<
    FetchResponse<Articles> | undefined
  >(["articles", id], () => getArticles(id));

  if (!articles) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{articles && `Edit Articles ${articles["@id"]}`}</title>
        </Head>
      </div>
      <Form articles={articles} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["articles", id], () => getArticles(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Articles>>("/articles");
  const paths = await getItemPaths(
    response,
    "articles",
    "/articless/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;

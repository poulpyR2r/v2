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

import { Show } from "../../../components/articles/Show";
import { PagedCollection } from "../../../types/collection";
import { Articles } from "../../../types/Articles";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getArticles = async (id: string | string[] | undefined) =>
  id ? await fetch<Articles>(`/articles/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: articles, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Articles> | undefined>(["articles", id], () =>
    getArticles(id)
  );
  const articlesData = useMercure(articles, hubURL);

  if (!articlesData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Articles ${articlesData["@id"]}`}</title>
        </Head>
      </div>
      <Show articles={articlesData} text={text} />
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
  const paths = await getItemPaths(response, "articles", "/articless/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;

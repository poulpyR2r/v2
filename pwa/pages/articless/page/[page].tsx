import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getArticless,
  getArticlessPath,
} from "../../../components/articles/PageList";
import { PagedCollection } from "../../../types/collection";
import { Articles } from "../../../types/Articles";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getArticlessPath(page), getArticless(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Articles>>("/articles");
  const paths = await getCollectionPaths(
    response,
    "articles",
    "/articless/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;

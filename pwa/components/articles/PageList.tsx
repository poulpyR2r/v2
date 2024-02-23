import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Articles } from "../../types/Articles";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getArticlessPath = (page?: string | string[] | undefined) =>
  `/articles${typeof page === "string" ? `?page=${page}` : ""}`;
export const getArticless =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Articles>>(getArticlessPath(page));
const getPagePath = (path: string) =>
  `/articless/page/${parsePage("articles", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: articless, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Articles>> | undefined
  >(getArticlessPath(page), getArticless(page));
  const collection = useMercure(articless, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Articles List</title>
        </Head>
      </div>
      <List articless={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};

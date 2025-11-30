import type { ChainId } from "@reactive-dot/core";
import { Route } from "~/routes/__root";

export function useRouteChainId() {
  const { chain: searchChainId } = Route.useSearch();
  return (
    (searchChainId?.replaceAll("-", "_") as ChainId | undefined) ?? "polkadot_asset_hub"
  );
}

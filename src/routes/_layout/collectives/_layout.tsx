import { idle } from "@reactive-dot/core";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { Await, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteTabs } from "~/components/route-tabs";
import { useCollectivesChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/collectives/_layout")({
  component: CollectivesPage,
});

function CollectivesPage() {
  const collectivesChainId = useCollectivesChainId(false);

  return (
    <RouteTabs>
      <RouteTabs.Item
        to="/collectives/fellowship"
        label="Fellowship"
        badge={
          <Suspense>
            <Await
              promise={useLazyLoadQuery(
                (builder) =>
                  collectivesChainId === undefined
                    ? undefined
                    : builder.storageEntries("FellowshipCore", "Member"),
                { chainId: collectivesChainId, use: false },
              )}
            >
              {(members) =>
                members === idle ? null : members.length.toLocaleString()
              }
            </Await>
          </Suspense>
        }
      />
      <RouteTabs.Item
        to="/collectives/ambassador"
        label="Ambassador"
        badge={
          <Suspense>
            <Await
              promise={useLazyLoadQuery(
                (query) => query.storageEntries("AmbassadorCore", "Member"),
                { chainId: collectivesChainId, use: false },
              )}
            >
              {(members) => members.length.toLocaleString()}
            </Await>
          </Suspense>
        }
      />
    </RouteTabs>
  );
}

import { config } from "../config";
import { pending } from "@reactive-dot/core";
import { unstable_getBlockExtrinsics } from "@reactive-dot/core/internal/actions.js";
import {
  ChainProvider,
  ReactiveDotProvider,
  useChainId,
  useClient,
  useMutationEffect,
  useTypedApi,
} from "@reactive-dot/react";
import {
  createRootRoute,
  Outlet,
  retainSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import Close from "@w3f/polkadot-icons/solid/Close";
import "dot-connect/font.css";
import { useSetAtom } from "jotai";
import type { BlockInfo } from "polkadot-api";
import { useEffect, useEffectEvent } from "react";
import "react18-json-view/src/dark.css";
import "react18-json-view/src/style.css";
import { mergeMap, type Subscription } from "rxjs";
import z from "zod";
import { IconButton } from "~/components/ui/icon-button";
import { Toaster } from "~/components/ui/styled/toast";
import { Toast } from "~/components/ui/toast";
import {
  blockExtrinsicsMapAtom,
  blockMapAtom,
  type DisplayBlock,
} from "~/features/explorer/stores/blocks";
import type { Extrinsic } from "~/features/explorer/types";
import { useRouteChainId } from "~/hooks/use-route-chain-id";
import { toaster } from "~/toaster";

const searchSchema = z.object({
  chain: z.string().optional(),
});

export const Route = createRootRoute({
  component: Root,
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(["chain"])],
  },
});

function Root() {
  const chainId = useRouteChainId();

  return (
    <ReactiveDotProvider config={config}>
      <ChainProvider chainId={chainId}>
        <Outlet />
        <BlockTracker />
        <MutationToaster />
      </ChainProvider>
    </ReactiveDotProvider>
  );
}

function BlockTracker() {
  return <BlockTrackerInner key={useChainId()} />;
}

function BlockTrackerInner() {
  const setBlockMap = useSetAtom(blockMapAtom);

  const client = useClient();
  const typedApi = useTypedApi();

  const onUnMount = useEffectEvent(() => setBlockMap(new Map()));

  useEffect(() => {
    onUnMount();
  }, []);

  const onBestBlocks = useEffectEvent((bestBlocks: BlockInfo[]) => {
    setBlockMap((blocks) => {
      const newBlocks = new Map<number, DisplayBlock>(blocks);

      for (const block of bestBlocks) {
        newBlocks.set(block.number, {
          ...block,
          release: client.hodlBlock(block.hash),
        });
      }

      return newBlocks;
    });
  });

  useEffect(() => {
    const subscription = client.bestBlocks$.subscribe({
      next: onBestBlocks,
    });

    return () => subscription.unsubscribe();
  }, [client]);

  const setBlockExtrinsicsMap = useSetAtom(blockExtrinsicsMapAtom);

  const onNewBlockExtrinsics = useEffectEvent(
    (
      blocks: {
        extrinsics: Extrinsic[] | undefined;
        hash: string;
        number: number;
        parent: string;
        hasNewRuntime: boolean;
      }[],
    ) =>
      setBlockExtrinsicsMap((prevBlocks) => {
        const newBlocks = new Map(prevBlocks);

        for (const block of blocks) {
          if (block.extrinsics !== undefined) {
            newBlocks.set(block.hash, block.extrinsics);
          }
        }

        return newBlocks;
      }),
  );

  useEffect(() => {
    let subscription: Subscription;

    const startSubscription = () => {
      subscription = client.bestBlocks$
        .pipe(
          mergeMap((blocks) =>
            Promise.all(
              blocks.map((block) =>
                unstable_getBlockExtrinsics(client, typedApi, block.hash).then(
                  (extrinsics) => ({ ...block, extrinsics }),
                ),
              ),
            ),
          ),
        )
        .subscribe({
          next: onNewBlockExtrinsics,
          error: (error) => {
            console.error("block error", error);
            return startSubscription();
          },
        });
    };

    startSubscription();

    return () => subscription.unsubscribe();
  }, [client, typedApi]);

  return null;
}

function MutationToaster() {
  useMutationEffect((event) => {
    if (event.value === pending) {
      toaster.loading({ id: event.id, title: "Submitting transaction" });
      return;
    }

    if (event.value instanceof Error) {
      toaster.error({ id: event.id, title: "Failed to submit transaction" });
      return;
    }

    switch (event.value.type) {
      case "finalized":
        if (event.value.ok) {
          toaster.success({ id: event.id, title: "Submitted transaction" });
        } else {
          toaster.error({ id: event.id, title: "Transaction failed" });
        }
        break;
      default:
        toaster.loading({ id: event.id, title: "Transaction pending" });
    }
  });

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.CloseTrigger asChild>
            <IconButton variant="link" size="sm">
              <Close fill="currentcolor" />
            </IconButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  );
}

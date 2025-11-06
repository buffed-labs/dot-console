import { AccountListItem } from "../../accounts/components/account-list-item";
import { ScaleEnum, Struct, u32, u64 } from "@polkadot-api/substrate-bindings";
import { idle } from "@reactive-dot/core";
import { useChainId, useLazyLoadQuery, useTypedApi } from "@reactive-dot/react";
import type { ChainDefinition, UnsafeApi } from "polkadot-api";
import { Suspense, use, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";

const babeDigestCodec = ScaleEnum({
  authority_index: u32,
  one: u32,
  two: u32,
  three: u32,
});

const auraDigestCodec = Struct({ slotNumber: u64 });

export type BlockAuthorProps = {
  blockHash: string;
};

export function BlockAuthor(props: BlockAuthorProps) {
  return (
    <ErrorBoundary fallback={<>Error fetching block's author</>}>
      <Suspense fallback={<CircularProgressIndicator />}>
        <SuspendableBlockAuthor {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

export function SuspendableBlockAuthor({ blockHash }: BlockAuthorProps) {
  const chainId = useChainId();

  const digest = useLazyLoadQuery((builder) =>
    builder.storage("System", "Digest", undefined, {
      at: blockHash as `0x${string}`,
    }),
  );

  const digestValue = digest.at(0)?.value;

  const digestData =
    digestValue === undefined
      ? undefined
      : Array.isArray(digestValue)
        ? digestValue[1]
        : digestValue;

  const typedApi = useTypedApi();

  const compatibilityToken = use(
    (typedApi as unknown as UnsafeApi<ChainDefinition>).runtimeToken,
  );

  let chainType: "babe" | "aura";
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typedApi.constants.Babe.EpochDuration(compatibilityToken as any);
    chainType = "babe";
  } catch {
    chainType = "aura";
  }

  const authorIdOrSlotNumber = useMemo(() => {
    if (digestData === undefined) {
      return undefined;
    }

    if (chainType === "babe") {
      return babeDigestCodec.dec(digestData.asBytes()).value;
    }

    return Number(auraDigestCodec.dec(digestData.asBytes()).slotNumber);
  }, [chainType, digestData]);

  const validators = useLazyLoadQuery(
    (builder) =>
      chainType === "aura"
        ? undefined
        : builder.storage("Session", "Validators", undefined, {
            at: blockHash as `0x${string}`,
          }),
    { chainId: chainId as "polkadot" },
  );

  const collators = useLazyLoadQuery(
    (builder) =>
      chainType === "babe"
        ? undefined
        : builder.storage("CollatorSelection", "Invulnerables", undefined, {
            at: blockHash as `0x${string}`,
          }),
    { chainId: chainId as "polkadot_asset_hub" },
  );

  const authors = useMemo(() => {
    if (validators !== idle) {
      return validators;
    }

    if (collators !== idle) {
      return collators;
    }

    return undefined;
  }, [collators, validators]);

  const authorIndex = useMemo(() => {
    if (authorIdOrSlotNumber === undefined || authors === undefined) {
      return undefined;
    }

    if (chainType === "aura") {
      return authorIdOrSlotNumber % authors.length;
    }

    return authorIdOrSlotNumber;
  }, [authorIdOrSlotNumber, authors, chainType]);

  const author =
    authorIndex === undefined ? undefined : authors?.at(authorIndex);

  if (author === undefined) {
    return null;
  }

  return <AccountListItem address={author} name={undefined} />;
}

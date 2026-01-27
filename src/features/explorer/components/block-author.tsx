import { AccountListItem } from "../../accounts/components/account-list-item";
import {
  _void,
  Bytes,
  Struct,
  u32,
  u64,
  Variant,
} from "@polkadot-api/substrate-bindings";
import { idle } from "@reactive-dot/core";
import { useChainId, useLazyLoadQuery } from "@reactive-dot/react";
import { Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { useChainType } from "~/hooks/use-chain-type";

const digestWithVRFCodec = Struct({
  authority_index: u32,
  slot: u64,
  vrf_signature: Struct({
    pre_output: Bytes(32),
    proof: Bytes(64),
  }),
});

const babeDigestCodec = Variant({
  Unknown: _void,
  Primary: digestWithVRFCodec,
  SecondaryPlain: Struct({
    authority_index: u32,
    slot: u64,
  }),
  SecondaryVRF: digestWithVRFCodec,
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

  const digests = useLazyLoadQuery((builder) =>
    builder.storage("System", "Digest", undefined, {
      at: blockHash as `0x${string}`,
    }),
  );

  const babeOrAuraDigest = digests.find(
    (digest) =>
      digest.type === "PreRuntime" &&
      ["babe", "aura"].includes(digest.value[0].asText()),
  )?.value;

  const digestValue = Array.isArray(babeOrAuraDigest)
    ? babeOrAuraDigest[1]
    : babeOrAuraDigest;

  const chainType = useChainType();

  const authorIdOrSlotNumber = useMemo(() => {
    if (digestValue === undefined) {
      return undefined;
    }

    if (chainType === "babe") {
      return babeDigestCodec.dec(digestValue.asBytes()).value?.authority_index;
    }

    return Number(auraDigestCodec.dec(digestValue.asBytes()).slotNumber);
  }, [chainType, digestValue]);

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

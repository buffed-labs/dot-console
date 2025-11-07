import { useTypedApi } from "@reactive-dot/react";
import type { UnsafeApi, ChainDefinition } from "polkadot-api";
import { use } from "react";

export function useChainType() {
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

  return chainType;
}

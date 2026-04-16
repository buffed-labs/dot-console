import { useTypedApi } from "@reactive-dot/react";
import type { ChainDefinition, TypedApi } from "polkadot-api";
import { use, useMemo } from "react";

export function useChainType() {
  const typedApi = useTypedApi() as TypedApi<ChainDefinition>;

  const chainTypePromise = useMemo(async () => {
    try {
      await typedApi.constants["Babe"]?.["EpochDuration"]?.();
      return "babe" as const;
    } catch {
      return "aura" as const;
    }
  }, [typedApi]);

  return use(chainTypePromise);
}

import type { ChainId } from "@reactive-dot/core";
import { useChainId } from "@reactive-dot/react";
import type { PropsWithChildren } from "react";

type ChainGuardProps = PropsWithChildren<{ denylist: ChainId[] }>;

export function ChainGuard({ denylist, children }: ChainGuardProps) {
  const chainId = useChainId();

  if (denylist.includes(chainId)) {
    return null;
  }

  return children;
}

export function NoCustomChain({ children }: PropsWithChildren) {
  return <ChainGuard denylist={["custom"]}>{children}</ChainGuard>;
}

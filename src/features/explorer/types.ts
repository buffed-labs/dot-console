import type { unstable_getBlockExtrinsics } from "@reactive-dot/core/internal/actions.js";

export type Extrinsic = NonNullable<
  Awaited<ReturnType<typeof unstable_getBlockExtrinsics>>
>[number];

export type BlockInfo = {
  hash: string;
  number: number;
  parent: string;
  extrinsics?: Extrinsic[] | undefined;
};

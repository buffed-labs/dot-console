import { useLazyLoadQuery, useSpendableBalance } from "@reactive-dot/react";
import { DenominatedNumber } from "@reactive-dot/utils";
import { AccountId, Binary } from "polkadot-api";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Badge } from "~/components/ui/badge";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useAssetHubChainId } from "~/hooks/chain";

export function TreasuryBalances() {
  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5ch",
        padding: "1rem",
      })}
    >
      <header>
        <TreasuryAccount />
      </header>
      <div className={css({ display: "flex", gap: "1em", flexWrap: "wrap" })}>
        <article>
          <header className={css({ marginBottom: "0.25em" })}>Native</header>
          <p>
            <Suspense fallback={<CircularProgressIndicator size="text" />}>
              <NativeBalance />
            </Suspense>
          </p>
        </article>
        <article>
          <header className={css({ marginBottom: "0.25em" })}>Others</header>
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <NonNativeBalances />
          </Suspense>
        </article>
      </div>
    </section>
  );
}

function TreasuryAccount() {
  return <AccountListItem address={useTreasuryAccount()} name="Treasury" />;
}

function NativeBalance() {
  return (
    <Balance
      value={useSpendableBalance(useTreasuryAccount(), {
        chainId: useAssetHubChainId(),
      })}
    />
  );
}

function NonNativeBalances() {
  return <NonNativeBalancesInner account={useTreasuryAccount()} />;
}

type AssetHubBalancesProps = {
  account: string;
};

function NonNativeBalancesInner({ account }: AssetHubBalancesProps) {
  const assets = useLazyLoadQuery(
    (builder) => builder.storageEntries("Assets", "Asset", []),
    { chainId: useAssetHubChainId() },
  );

  const _treasuryAssetHoldings = useLazyLoadQuery(
    (builder) =>
      builder.storages(
        "Assets",
        "Account",
        assets.map(([[assetId]]) => [assetId, account] as const),
      ),
    { chainId: useAssetHubChainId() },
  );

  const treasuryAssetHoldings = _treasuryAssetHoldings
    .map(
      (holding, index) =>
        [assets.at(index)![0][0], holding?.balance ?? 0n] as const,
    )
    .filter((x) => x[1] > 0n);

  return (
    <ul className={css({ display: "flex", gap: "0.5ch", flexWrap: "wrap" })}>
      {treasuryAssetHoldings.map(([assetId, balance]) => (
        <AssetBalance key={assetId} assetId={assetId} balance={balance} />
      ))}
    </ul>
  );
}

type AssetBalanceProps = {
  assetId: number;
  balance: bigint;
};

function AssetBalance({ assetId, balance }: AssetBalanceProps) {
  const metadata = useLazyLoadQuery(
    (builder) => builder.storage("Assets", "Metadata", [assetId]),
    { chainId: useAssetHubChainId() },
  );

  return (
    <Balance
      value={
        new DenominatedNumber(
          balance,
          metadata.decimals,
          metadata.symbol.asText(),
        )
      }
    />
  );
}

type BalanceProps = {
  value: DenominatedNumber;
};

function Balance({ value }: BalanceProps) {
  return (
    <Badge size="lg" fontWeight="medium">
      {value.toLocaleString(undefined, { notation: "compact" })}
    </Badge>
  );
}

function useTreasuryAccount() {
  const [ss58Prefix, treasuryPalletId] = useLazyLoadQuery(
    (builder) =>
      builder.constant("System", "SS58Prefix").constant("Treasury", "PalletId"),
    { chainId: useAssetHubChainId() },
  );

  const treasuryAccountBytes = new Uint8Array([
    ...Binary.fromText("modl").asBytes(),
    ...treasuryPalletId.asBytes(),
  ]);

  return AccountId(ss58Prefix).dec(
    Uint8Array.from(
      { length: 32 },
      (_, index) => treasuryAccountBytes.at(index) ?? 0,
    ),
  );
}

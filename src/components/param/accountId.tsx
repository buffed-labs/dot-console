import { AccountSelect } from "../account-select";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import { getSs58AddressInfo } from "@polkadot-api/substrate-bindings";
import type {
  AccountIdDecoded,
  EthAccountDecoded,
} from "@polkadot-api/view-builder";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAccounts } from "@reactive-dot/react";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type AccountIdParamProps = ParamProps<string> & {
  accountId: { codec: "AccountId" | "ethAccount" };
  defaultValue: AccountIdDecoded | EthAccountDecoded | undefined;
};

export function AccountIdParam({
  accountId,
  defaultValue,
  onChangeValue,
}: AccountIdParamProps) {
  const accounts = useAccounts();
  const [account, setAccount] = useState(accounts.at(0));

  const [useCustom, setUseCustom] = useState(
    accounts.length === 0 || defaultValue !== undefined,
  );

  const onChangeAccount = useEffectEvent(
    (account: WalletAccount | undefined) => {
      if (account !== undefined) {
        onChangeValue(account.address);
      }
    },
  );

  useEffect(() => onChangeAccount(account));

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <Switch
        checked={useCustom}
        onCheckedChange={(event) => setUseCustom(event.checked)}
      >
        Use custom account
      </Switch>
      {useCustom ? (
        <CustomAccountParam
          accountId={accountId}
          defaultValue={defaultValue}
          onChangeValue={onChangeValue}
        />
      ) : (
        <AccountSelect
          accounts={accounts}
          account={account}
          onChangeAccount={setAccount}
        />
      )}
    </section>
  );
}

type CustomAccountParamProps = ParamProps<string> & {
  accountId: { codec: "AccountId" | "ethAccount" };
  defaultValue: AccountIdDecoded | EthAccountDecoded | undefined;
};

function CustomAccountParam({
  accountId,
  defaultValue,
  onChangeValue,
}: CustomAccountParamProps) {
  const [value, setValue] = useState(
    (typeof defaultValue?.value === "string"
      ? defaultValue.value
      : defaultValue?.value.address) ?? "",
  );

  const derivedValue = useMemo(
    () =>
      value.trim() === ""
        ? INCOMPLETE
        : getSs58AddressInfo(value).isValid
          ? value
          : INVALID,
    [value],
  );

  const onChangeDerivedValue = useEffectEvent(
    (value: string | typeof INCOMPLETE | typeof INVALID) =>
      onChangeValue(value),
  );

  useEffect(() => onChangeDerivedValue(derivedValue), [derivedValue]);

  return (
    <Input
      type="text"
      placeholder={accountId.codec}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

import { Field } from "../ui/field";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import { nativeTokenInfoFromChainSpecData } from "@reactive-dot/core/internal.js";
import {
  useChainSpecData,
  useNativeTokenAmountFromNumber,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import {
  Suspense,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

export type NativeAmountProps = ParamProps<bigint> & {
  shape: { codec: "compactNumber" | "compactBn" | "u128" };
  defaultValue: { value: number | bigint } | undefined;
};

export function NativeAmountParam(props: NativeAmountProps) {
  // Needed due to Suspense losing initial default
  const initialDefault = useRef(props.defaultValue);

  return (
    <Suspense>
      <INTERNAL_NativeAmountParam
        {...props}
        // eslint-disable-next-line react-hooks/refs
        defaultValue={initialDefault.current}
      />
    </Suspense>
  );
}

function INTERNAL_NativeAmountParam({
  defaultValue,
  onChangeValue,
}: NativeAmountProps) {
  const chainSpecData = useChainSpecData();
  const nativeTokenInfo = useMemo(
    () => nativeTokenInfoFromChainSpecData(chainSpecData),
    [chainSpecData],
  );
  const nativeTokenAmount = useNativeTokenAmountFromNumber();
  const nativeTokenAmountFromPlanck = useNativeTokenAmountFromPlanck();

  const [value, setValue] = useState(() =>
    defaultValue?.value === undefined
      ? ""
      : nativeTokenAmountFromPlanck(defaultValue.value.toString()).toString(),
  );

  const parsedValue = useMemo(() => {
    if (value.trim() === "") {
      return INCOMPLETE;
    }

    try {
      return nativeTokenAmount(value).planck;
    } catch {
      return INVALID;
    }
  }, [nativeTokenAmount, value]);

  const onChangeParsedValue = useEffectEvent(
    (value: bigint | typeof INCOMPLETE | typeof INVALID) =>
      onChangeValue(value),
  );

  useEffect(() => onChangeParsedValue(parsedValue), [parsedValue]);

  return (
    <Field.Root
      required={parsedValue === INCOMPLETE}
      invalid={parsedValue === INVALID}
    >
      <Field.Input
        inputMode="numeric"
        placeholder={nativeTokenInfo.code}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Field.Root>
  );
}

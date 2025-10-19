import { Field } from "../ui/field";
import {
  INCOMPLETE,
  INVALID,
  integerPrimitives,
  type ParamProps,
} from "./common";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

export type CompactParamProps = ParamProps<number | bigint> & {
  compact: { codec: "compactNumber" | "compactBn" };
  defaultValue: { value: number | bigint } | undefined;
};

export function CompactParam({
  compact,
  defaultValue,
  onChangeValue,
}: CompactParamProps) {
  const [value, setValue] = useState(defaultValue?.value.toString() ?? "");

  const isBig = compact.codec === "compactBn";

  const parsedValue = useMemo(() => {
    if (value.trim() === "") {
      return INCOMPLETE;
    }

    if (!isBig) {
      const number = Number(value);

      if (
        Number.isNaN(number) ||
        !Number.isFinite(number) ||
        number < SMALL.min ||
        number > SMALL.max
      ) {
        return INVALID;
      }

      return number;
    }

    try {
      const bn = BigInt(value);

      if (bn < BIG.min || bn > BIG.max) {
        return INVALID;
      }

      return bn;
    } catch {
      return INVALID;
    }
  }, [isBig, value]);

  const onChangeParsedValue = useEffectEvent(
    (value: number | bigint | typeof INCOMPLETE | typeof INVALID) =>
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
        placeholder="Compact"
        value={value}
        min={isBig ? BIG.min.toString() : SMALL.min}
        max={isBig ? BIG.max.toString() : SMALL.max}
        onChange={(event) => setValue(event.target.value)}
      />
    </Field.Root>
  );
}

const SMALL = {
  min: integerPrimitives.i32.min,
  max: integerPrimitives.u32.max,
};

const BIG = {
  min: integerPrimitives.i128.min,
  max: integerPrimitives.u128.max,
};

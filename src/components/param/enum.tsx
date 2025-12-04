import { Select } from "../select";
import { CodecParam } from "./codec";
import type { ParamProps } from "./common";
import type { EnumDecoded, EnumShape } from "@polkadot-api/view-builder";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

export type EnumParamProps = ParamProps<
  { type: string } | { type: string; value: unknown }
> & {
  enum: EnumShape;
  defaultValue: EnumDecoded | undefined;
};

export function EnumParam(props: EnumParamProps) {
  return (
    <INTERNAL_EnumParam key={Object.keys(props.enum.shape).join()} {...props} />
  );
}

function INTERNAL_EnumParam({
  onChangeValue,
  defaultValue,
  ...props
}: EnumParamProps) {
  const enumShape = props.enum;

  const keys = Object.keys(enumShape.shape);
  const [key, setKey] = useState(defaultValue?.value.type ?? keys.at(0)!);

  const [value, setValue] = useState();

  const valueShape = enumShape.shape[key];

  const onChangeKeyAndValue = useEffectEvent((key: string, value: unknown) =>
    onChangeValue({ type: key, value }),
  );

  useEffect(() => onChangeKeyAndValue(key, value), [key, value]);

  return (
    <div>
      <Select
        variant="ghost"
        size="sm"
        width="fit-content"
        options={useMemo(
          () =>
            keys
              .toSorted((a, b) => a.localeCompare(b))
              .map((key) => ({ value: key, label: key })),
          [keys],
        )}
        value={key}
        onChangeValue={setKey}
      />
      {valueShape && (
        <CodecParam
          currentPath={key}
          shape={valueShape}
          defaultValue={
            defaultValue?.value.type === key
              ? defaultValue?.value.value
              : undefined
          }
          // @ts-expect-error TODO: improve Enum type
          onChangeValue={setValue}
          skipIndentation={valueShape.codec === "Enum"}
        />
      )}
    </div>
  );
}

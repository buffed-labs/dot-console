import { Switch } from "../ui/switch";
import { CodecParam } from "./codec";
import { INCOMPLETE, type ParamInput, type ParamProps } from "./common";
import type { OptionDecoded, OptionShape } from "@polkadot-api/view-builder";
import { useEffect, useEffectEvent, useState } from "react";

export type OptionParamProps<T> = ParamProps<undefined | T> & {
  option: OptionShape;
  defaultValue: OptionDecoded | undefined;
};

export function OptionParam<T>({
  option,
  defaultValue,
  onChangeValue,
}: OptionParamProps<T>) {
  const [includeOptional, setIncludeOptional] = useState(
    defaultValue?.value !== undefined,
  );
  const [value, setValue] = useState<ParamInput<T>>(INCOMPLETE);

  const derivedValue = includeOptional ? value : undefined;

  const onChangeDerivedValue = useEffectEvent(
    (value: ParamInput<T> | undefined) => onChangeValue(value),
  );

  useEffect(() => onChangeDerivedValue(derivedValue), [derivedValue]);

  return (
    <div>
      <Switch
        checked={includeOptional}
        onCheckedChange={(event) => setIncludeOptional(Boolean(event.checked))}
      >
        Include optional
      </Switch>
      {includeOptional && (
        <CodecParam
          shape={option.shape}
          defaultValue={defaultValue?.value}
          onChangeValue={setValue}
        />
      )}
    </div>
  );
}

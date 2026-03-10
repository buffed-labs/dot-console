import { ark } from "@ark-ui/react/factory";
import type { ComponentProps } from "react";
import { styled } from "styled-system/jsx";

const StyledLabel = styled(ark.label, {
  base: {
    alignItems: "center",
    color: "fg.default",
    display: "flex",
    gap: "0.5",
    textAlign: "start",
    userSelect: "none",
    textStyle: "label",
  },
});

export type FormLabelProps = ComponentProps<typeof StyledLabel>;
export const FormLabel = StyledLabel;

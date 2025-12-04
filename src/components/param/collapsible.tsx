import { Button } from "../ui/button";
import { Collapsible } from "../ui/collapsible";
import ChevronDownIcon from "@w3f/polkadot-icons/solid/ChevronDown";
import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { css, cx } from "styled-system/css";

type CollapsibleParamProps = PropsWithChildren<{
  label: ReactNode;
  leadingLabel?: ReactNode;
  trailingLabel?: ReactNode;
  aside?: ReactNode;
  style?: CSSProperties;
  className?: string;
}>;

export function CollapsibleParam({
  label,
  leadingLabel,
  trailingLabel,
  aside,
  style,
  className,
  children,
}: CollapsibleParamProps) {
  return (
    <Collapsible.Root
      defaultOpen
      style={style}
      className={cx(
        className,
        css({
          borderRadius: "md",
          overflow: "hidden",
          "&:has(>:first-child:hover), &:has(>:nth-child(2) > :first-child > :nth-child(2):hover)":
            {
              backgroundColor: "bg.subtle",
            },
        }),
      )}
    >
      <Collapsible.Trigger asChild>
        <Button variant="link" justifyContent="start" width="stretch">
          {leadingLabel}
          <Collapsible.Context>
            {({ open }) => (
              <ChevronDownIcon
                fill="currentcolor"
                style={{ rotate: !open ? "-90deg" : undefined }}
                className={css({ width: "0.75em", height: "0.75em" })}
              />
            )}
          </Collapsible.Context>
          {label}
          {trailingLabel !== undefined && (
            <div className={css({ marginStart: "auto" })}>{trailingLabel}</div>
          )}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div
          className={css({
            display: "flex",
            gap: "0.25rem",
            "&>*:first-child": { flex: 1 },
          })}
        >
          {children}
          {aside !== undefined && (
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                height: "fit-content",
              })}
            >
              {aside}
            </div>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

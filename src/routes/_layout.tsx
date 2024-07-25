import { Button, Heading, Progress, Select } from "../components/ui";
import type { ChainId } from "@reactive-dot/core";
import { ReDotChainProvider } from "@reactive-dot/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { Suspense, useState } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  // TODO: replace with dedicated hook once that is available
  const chainIds = ["polkadot", "kusama", "paseo"] as const satisfies ChainId[];
  const [chainId, setChainId] = useState(chainIds["0"] as ChainId);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      })}
    >
      <header
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 2rem",
          borderBottom: "1px solid currentcolor",
        })}
      >
        <Heading as="h1" size="2xl">
          📟 ĐÓTConsole
        </Heading>
        <nav
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          })}
        >
          <Select.Root
            items={chainIds}
            // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
            itemToString={(chainId) => chainId}
            // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
            itemToValue={(chainId) => chainId}
            value={[chainId]}
            onValueChange={(event) => {
              const chainId = event.items.at(0) as ChainId;

              if (chainId !== undefined) {
                setChainId(chainId);
              }
            }}
            positioning={{ fitViewport: true, sameWidth: true }}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select a chain" />
                <Select.Indicator>
                  <ChevronDown fill="currentcolor" />
                </Select.Indicator>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content
                className={css({
                  maxHeight: "max(50dvh, 8rem)",
                  overflow: "auto",
                })}
              >
                {chainIds.map((chainId) => (
                  <Select.Item key={chainId} item={chainId}>
                    <Select.ItemText>{chainId}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check fill="currentcolor" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          <Button variant="ghost" asChild>
            <Link
              to="/query"
              activeProps={{ className: css({ color: "accent.default" }) }}
            >
              Query
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              to="/extrinsic"
              activeProps={{ className: css({ color: "accent.default" }) }}
            >
              Extrinsic
            </Link>
          </Button>
        </nav>
        <dc-connection-button />
      </header>
      <main className={css({ display: "contents" })}>
        <ReDotChainProvider key={chainId} chainId={chainId}>
          <Suspense
            fallback={
              <div
                className={css({
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                })}
              >
                <Progress type="circular" value={null} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ReDotChainProvider>
      </main>
    </div>
  );
}

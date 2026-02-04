import { CodecView } from "../../../components/codec-view";
import { blocksAtom } from "../stores/blocks";
import type { BlockInfo } from "../types";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { useAtomValue } from "jotai";
import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { css } from "styled-system/css";
import { Collapsible } from "~/components/ui/collapsible";
import { Heading } from "~/components/ui/heading";
import { Table } from "~/components/ui/table";

export type EventsProps = {
  className?: string | undefined;
};

export function Events({ className }: EventsProps) {
  const blocks = useAtomValue(blocksAtom);

  return (
    <article>
      <header
        className={css({
          position: "sticky",
          top: 0,
          padding: "0.5rem 1rem",
          backgroundColor: "bg.default",
        })}
      >
        <Heading as="h3" size="xl">
          Recent events
        </Heading>
      </header>
      <BlockEventsTable
        blocks={blocks}
        caption="Recent events"
        className={className}
      />
    </article>
  );
}

export type BlockEventsTableProps = {
  caption?: ReactNode;
  filterNoise?: boolean;
  className?: string | undefined;
} & (
  | {
      blocks: BlockInfo[];
    }
  | { block: BlockInfo }
);

export function BlockEventsTable({
  caption,
  filterNoise,
  className,
  ...props
}: BlockEventsTableProps) {
  const blocks = "blocks" in props ? props.blocks : [props.block];

  return (
    <Table.Root className={className}>
      {caption && <Table.Caption>{caption}</Table.Caption>}
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Height</Table.Header>
          <Table.Header>Index</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {blocks.map((block) => (
          <ErrorBoundary
            key={block.hash}
            fallback={
              <Table.Row>
                <Table.Cell colSpan={3}>
                  Error fetching block #{block.number} events
                </Table.Cell>
              </Table.Row>
            }
          >
            <Suspense>
              <BlockEvents
                blockNumber={block.number}
                blockHash={block.hash}
                filterNoise={filterNoise}
              />
            </Suspense>
          </ErrorBoundary>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export type BlockEventsProps = {
  blockNumber: number;
  blockHash: string;
  filterNoise?: boolean | undefined;
};

const noisyEvents: Record<string, string[] | true> = {
  System: true,
  VoterList: true,
  Balances: ["Deposit", "UpdatedInactive", "Withdraw"],
  Treasury: ["Deposit", "UpdatedInactive", "Withdraw"],
  TransactionPayment: ["TransactionFeePaid"],
  ParaInclusion: ["CandidateBacked", "CandidateIncluded"],
  ParasInclusion: ["CandidateBacked", "CandidateIncluded"],
  Inclusion: ["CandidateBacked", "CandidateIncluded"],
  RelayChainInfo: ["CurrentBlockNumbers"],
};

export function BlockEvents({
  blockNumber,
  blockHash,
  filterNoise = true,
}: BlockEventsProps) {
  const events = useLazyLoadQuery((builder) =>
    builder.storage("System", "Events", undefined, {
      at: blockHash as `0x${string}`,
    }),
  );

  return (
    <>
      {events
        .map((event, index) => ({ ...event, eventIndex: index }))
        .filter(({ event }) => {
          if (!filterNoise) {
            return true;
          }

          const eventValue = event.value;
          if (eventValue === undefined) {
            return true;
          }

          const noisyEventTypes = noisyEvents[event.type];

          if (noisyEventTypes === undefined) {
            return true;
          }

          if (typeof noisyEventTypes === "boolean" && noisyEventTypes) {
            return false;
          }

          if (noisyEventTypes.includes(eventValue.type)) {
            return false;
          }

          return true;
        })
        .map(({ event, eventIndex }) => (
          <Collapsible.Root
            key={`${blockHash}-${eventIndex}`}
            className={css({ display: "contents" })}
          >
            <Collapsible.Trigger asChild>
              <Table.Row className={css({ cursor: "pointer" })}>
                <Table.Cell>
                  {event.type}
                  {event.value !== undefined && `.${event.value.type}`}
                </Table.Cell>
                <Table.Cell>{blockNumber.toLocaleString()}</Table.Cell>
                <Table.Cell>{eventIndex}</Table.Cell>
              </Table.Row>
            </Collapsible.Trigger>
            {event.value !== undefined && (
              <Collapsible.Content asChild>
                <Table.Row>
                  <Table.Cell colSpan={3} className={css({ padding: 0 })}>
                    <CodecView
                      value={event.value.value}
                      className={css({ borderRadius: 0 })}
                    />
                  </Table.Cell>
                </Table.Row>
              </Collapsible.Content>
            )}
          </Collapsible.Root>
        ))}
    </>
  );
}

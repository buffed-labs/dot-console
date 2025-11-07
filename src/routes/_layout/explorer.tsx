import { BlockDetail } from "../../features/explorer/components/block-detail";
import { Events } from "../../features/explorer/components/block-events";
import { Blocks } from "../../features/explorer/components/blocks";
import { Statistics } from "../../features/explorer/components/statistics";
import { blockInViewAtom } from "../../features/explorer/stores/blocks";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useEffect, useEffectEvent } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout/explorer")({
  component: ExplorerPage,
});

function ExplorerPage() {
  const [blockInView, setBlockInView] = useAtom(blockInViewAtom);

  const onUnMount = useEffectEvent(() => {
    setBlockInView(undefined);
  });

  useEffect(() => {
    return onUnMount;
  }, []);

  return blockInView === undefined ? <LiveView /> : <BlockDetail />;
}

function LiveView() {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
        "statistics"
        "blocks"
        "events"
      `,
        "@media(min-width: 68rem)": {
          flex: "1 1 0",
          gridTemplateAreas: `
          "statistics statistics"
          "blocks     events"
        `,
          gridAutoRows: "min-content 1fr",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          overflow: "hidden",
        },
      })}
    >
      <Statistics className={css({ gridArea: "statistics" })} />
      <div className={css({ gridArea: "blocks", overflow: "auto" })}>
        <Blocks />
      </div>
      <div className={css({ gridArea: "events", overflow: "auto" })}>
        <Events />
      </div>
    </div>
  );
}

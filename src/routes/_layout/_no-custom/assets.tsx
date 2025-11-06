import { createFileRoute } from "@tanstack/react-router";
import { AssetList } from "~/features/assets/components/assets";

export const Route = createFileRoute("/_layout/_no-custom/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  return <AssetList />;
}

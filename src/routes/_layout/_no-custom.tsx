import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NoCustomChain } from "~/components/chain-guard";

export const Route = createFileRoute("/_layout/_no-custom")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <NoCustomChain>
      <Outlet />
    </NoCustomChain>
  );
}

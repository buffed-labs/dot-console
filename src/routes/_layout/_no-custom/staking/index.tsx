import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_no-custom/staking/")({
  loader: () => redirect({ to: "/staking/validators" }),
});

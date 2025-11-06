import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_no-custom/collectives/")({
  loader: () => redirect({ to: "/collectives/fellowship" }),
});

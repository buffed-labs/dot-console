import { createFileRoute } from "@tanstack/react-router";
import { AmbassadorCollective } from "~/features/collectives/components/ambassador";

export const Route = createFileRoute("/_layout/_no-custom/collectives/_layout/ambassador")(
  {
    component: AmbassadorCollective,
  },
);

import { Timeline } from "@/components/Timeline";
import type { RouterInputs } from "@/lib/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const UserPage: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const where: RouterInputs["post"]["timeline"]["where"] = {
    author: {
      name: username,
    },
  };

  return (
    <div>
      <Timeline where={where} />
    </div>
  );
};

export default UserPage;

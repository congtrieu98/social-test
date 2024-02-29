import TaskDefault from "@/components/task-default/formTask";
import { checkAuth } from "@/lib/auth/utils";

const Home = async () => {
  await checkAuth()
  return <TaskDefault />;
};

export default Home;

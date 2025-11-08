import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  // No authentication needed for MongoDB backend - directly show Dashboard
  return <Dashboard />;
};

export default Index;

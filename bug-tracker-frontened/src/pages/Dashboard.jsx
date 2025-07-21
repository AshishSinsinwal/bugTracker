import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DeveloperDashboard from "./DeveloperDashboard";

const Dashboard = () => {
 const { user } = useAuth(); // Assume your AuthContext provides loading state

  // Wait until user and user.role are defined
  if (!user || !user.role) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      {user.role === "admin" ? <AdminDashboard /> : <DeveloperDashboard />}
    </div>
      

  );
};

export default Dashboard;

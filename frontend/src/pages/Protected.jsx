import Layout from "../components/Layout";
import AdminDashboard from "./dashboards/AdminDashboard";
import TeachersDashboard from "./dashboards/TeachersDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

export default function Protected() {
  const role = localStorage.getItem("role");

  let Page = StudentDashboard;
  if (role === "teacher") Page = TeachersDashboard;
  if (role === "admin") Page = AdminDashboard;

  return (
    <Layout>
      <Page />
    </Layout>
  );
}

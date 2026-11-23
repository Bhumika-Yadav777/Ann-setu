
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

import {
  Users,
  Utensils,
  CheckCircle,
  Clock
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import UsersTable from "../components/UsersTable";
import DonationsTable from "../components/DonationsTable";
import NGOApprovals from "../components/NGOApprovals";


function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");

  const pageTitles = {
    overview: "Dashboard Overview",
    users: "User Management",
    donations: "Donation Management",
    ngos: "NGO Approvals"
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{pageTitles[activePage]}</h1>
            <p>Welcome to the Ann-Setu administration panel.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          
{activePage === "overview" && (
  <>
    <div className="admin-welcome">
      <h2>Welcome to Ann-Setu Admin</h2>
      <p>
        Manage users, monitor food donations, and verify NGO
        registrations from one place.
      </p>
    </div>

    <div className="admin-stats-grid">
      <StatsCard
        title="Total Users"
        value="125"
        description="Registered users"
        icon={Users}
        color="#2563eb"
      />

      <StatsCard
        title="Total Donations"
        value="86"
        description="Food donations submitted"
        icon={Utensils}
        color="#d97706"
      />

      <StatsCard
        title="Completed Donations"
        value="54"
        description="Successfully delivered"
        icon={CheckCircle}
        color="#16a34a"
      />

      <StatsCard
        title="Pending NGO Approvals"
        value="12"
        description="Waiting for verification"
        icon={Clock}
        color="#9333ea"
      />
    </div>
  </>
)}


          {activePage === "users" && <UsersTable />}

          {activePage === "donations" && <DonationsTable />}

         {activePage === "ngos" && <NGOApprovals />}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;

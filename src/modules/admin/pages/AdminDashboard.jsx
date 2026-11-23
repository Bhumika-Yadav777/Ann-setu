
import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

import { Users, Utensils, CheckCircle, Clock } from "lucide-react";

import StatsCard from "../components/StatsCard";
import UsersTable from "../components/UsersTable";
import DonationsTable from "../components/DonationsTable";
import NGOApprovals from "../components/NGOApprovals";

import { supabase } from "../../../services/supabaseClient";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    completedDonations: 0,
    pendingNGOs: 0
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const pageTitles = {
    overview: "Dashboard Overview",
    users: "User Management",
    donations: "Donation Management",
    ngos: "NGO Approvals"
  };

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError("");

      const [
        usersResult,
        donationsResult,
        completedResult,
        pendingNGOsResult
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("food_donations")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("food_donations")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),

        supabase
          .from("ngo_verifications")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")
      ]);

      const results = [
        usersResult,
        donationsResult,
        completedResult,
        pendingNGOsResult
      ];

      const failedResult = results.find((result) => result.error);

      if (failedResult) {
        console.error("Dashboard stats failed:", failedResult.error.message);
        setStatsError(failedResult.error.message);
      } else {
        setStats({
          totalUsers: usersResult.count ?? 0,
          totalDonations: donationsResult.count ?? 0,
          completedDonations: completedResult.count ?? 0,
          pendingNGOs: pendingNGOsResult.count ?? 0
        });
      }

      setStatsLoading(false);
    };

    fetchStats();
  }, []);

  const displayValue = (value) =>
    statsLoading ? "..." : value;

  return (
    <div className="admin-layout">
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />

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

              {statsError && (
                <p className="empty-table">
                  Failed to load dashboard statistics: {statsError}
                </p>
              )}

              <div className="admin-stats-grid">
                <StatsCard
                  title="Total Users"
                  value={displayValue(stats.totalUsers)}
                  description="Registered users"
                  icon={Users}
                  color="#2563eb"
                />

                <StatsCard
                  title="Total Donations"
                  value={displayValue(stats.totalDonations)}
                  description="Food donations submitted"
                  icon={Utensils}
                  color="#d97706"
                />

                <StatsCard
                  title="Completed Donations"
                  value={displayValue(stats.completedDonations)}
                  description="Successfully delivered"
                  icon={CheckCircle}
                  color="#16a34a"
                />

                <StatsCard
                  title="Pending NGO Approvals"
                  value={displayValue(stats.pendingNGOs)}
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

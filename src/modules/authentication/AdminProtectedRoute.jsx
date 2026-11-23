
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "./useAuth";

function AdminProtectedRoute() {
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error("Admin role check failed:", error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data.role === "admin");
      }

      setCheckingRole(false);
    };

    if (!authLoading) {
      checkAdminRole();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  if (authLoading || checkingRole) {
    return <p>Verifying admin access...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;

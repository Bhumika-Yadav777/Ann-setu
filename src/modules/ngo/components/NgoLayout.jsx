
import { Outlet } from "react-router-dom";
import NgoSidebar from "./NgoSidebar";
import "../styles/ngo.css";

function NgoLayout() {
  return (
    <div className="ngo-layout">

      <NgoSidebar />

      <main className="ngo-main">
        <Outlet />
      </main>

    </div>
  );
}

export default NgoLayout;

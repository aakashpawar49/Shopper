import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
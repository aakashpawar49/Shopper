import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import PageLoader from "../Common/PageLoader";
import BackToTop from "../Common/BackToTop";

const UserLayout = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Header and footer stay on screen while a lazy page loads */}
        <Suspense fallback={<PageLoader />}>
          {/* Re-keying on the path replays the fade-in on every page change */}
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default UserLayout;

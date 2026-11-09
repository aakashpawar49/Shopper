import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

// The announcement bar scrolls away; the navbar sticks to the top
const Header = () => {
  return (
    <>
      <Topbar />
      <header className="sticky top-0 z-40">
        <Navbar />
      </header>
    </>
  );
};

export default Header;

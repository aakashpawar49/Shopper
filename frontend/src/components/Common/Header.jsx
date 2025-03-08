import Topbar from "../Layout/Topbar"
import Navbar from "./Navbar"

const Header = () => {
  return (
    <header className="border-b border-gray-200">
        {/* Topbar */}
        <Topbar />
        {/* Navbar */}
        {/* Cart Drawer */}
        <Navbar />
    </header>
  )
}

export default Header
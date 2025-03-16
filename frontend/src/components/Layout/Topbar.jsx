import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Social Icons - Hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="javascript:void(0);" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="javascript:void(0);" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="javascript:void(0);" className="hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* Announcement */}
        <div className="text-sm text-center">
          <span>We ship worldwide - Fast and reliable shopping!</span>
        </div>

        {/* Contact Info */}
        <div className="text-sm">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

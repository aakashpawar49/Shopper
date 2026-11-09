import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const ANNOUNCEMENTS = [
  "Free worldwide shipping on orders over ₹200",
  "45-day hassle-free returns",
  "New drops every week",
  "Secure checkout",
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: TbBrandMeta },
  { label: "Instagram", href: "https://www.instagram.com", Icon: IoLogoInstagram },
  { label: "X (Twitter)", href: "https://twitter.com", Icon: RiTwitterXLine },
];

const AnnouncementList = (props) => (
  <ul className="flex shrink-0 items-center" {...props}>
    {ANNOUNCEMENTS.map((text) => (
      <li key={text} className="flex items-center whitespace-nowrap">
        <span className="px-6">{text}</span>
        <span className="text-white/60" aria-hidden="true">✦</span>
      </li>
    ))}
  </ul>
);

const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-xs text-white sm:text-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-2.5">
        {/* Social icons (desktop) */}
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition hover:-translate-y-0.5 hover:text-white/70"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Scrolling announcements. The list is rendered twice so the loop is
            seamless; the copy is hidden from screen readers. Hover pauses it. */}
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <AnnouncementList />
            <AnnouncementList aria-hidden="true" />
          </div>
        </div>

        {/* Contact (desktop) */}
        <a href="tel:+1234567890" className="hidden shrink-0 transition hover:text-white/70 md:block">
          +1 (234) 567-890
        </a>
      </div>
    </div>
  );
};

export default Topbar;

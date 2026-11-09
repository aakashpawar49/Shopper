import Reveal from "./Reveal";

// Consistent section title: small red eyebrow, large title, optional subtitle
const SectionHeading = ({ eyebrow, title, subtitle, align = "center", className = "", children }) => {
  const alignment = align === "left" ? "text-left" : "mx-auto text-center";

  return (
    <Reveal className={`mb-10 max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rabbit-red">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-gray-600 md:text-lg">{subtitle}</p>}
      {children}
    </Reveal>
  );
};

export default SectionHeading;

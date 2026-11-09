import useInView from "../../hooks/useInView";

// Fades and slides its children in the first time they scroll into view.
// `delay` (ms) staggers neighbouring items; `as` picks the wrapper element.
const Reveal = ({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) => {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

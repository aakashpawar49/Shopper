const WORDS = ["New Season", "Linen Edit", "Denim", "Streetwear", "Summer Essentials", "Limited Drops"];

// Decorative band of oversized words scrolling sideways. The word list is
// rendered twice so the loop is seamless.
const BrandMarquee = () => {
  return (
    <section aria-hidden="true" className="overflow-hidden border-y border-gray-200 py-6 md:py-8">
      <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {WORDS.map((word, index) => (
              <span
                key={word}
                className="flex items-center text-4xl font-black uppercase tracking-tighter text-gray-950 md:text-6xl"
              >
                {/* Alternate words switch to the italic display serif */}
                <span className={index % 2 ? "font-display font-medium normal-case italic tracking-normal" : ""}>
                  {word}
                </span>
                <span className="mx-8 text-2xl text-rabbit-red md:text-4xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandMarquee;

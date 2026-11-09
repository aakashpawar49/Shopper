// Shimmering placeholders shown while data loads, sized like the real content
// so the page doesn't jump when it arrives.

export const ProductCardSkeleton = () => (
  <div aria-hidden="true">
    <div className="skeleton mb-4 aspect-[4/5] rounded-2xl" />
    <div className="skeleton mb-2 h-4 w-3/4" />
    <div className="skeleton h-4 w-1/4" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div role="status" className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
    <span className="sr-only">Loading products…</span>
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div role="status" className="container mx-auto grid gap-10 px-6 py-10 md:grid-cols-2">
    <div className="skeleton aspect-[4/5] rounded-2xl" />
    <div className="space-y-4 pt-4">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-9 w-3/4" />
      <div className="skeleton h-7 w-28" />
      <div className="skeleton h-20 w-full" />
      <div className="skeleton h-10 w-2/3" />
      <div className="skeleton h-10 w-1/2" />
      <div className="skeleton h-12 w-full rounded-full" />
    </div>
    <span className="sr-only">Loading product…</span>
  </div>
);

export const TableRowsSkeleton = ({ rows = 4, columns = 6 }) =>
  Array.from({ length: rows }, (_, row) => (
    <tr key={row} aria-hidden="true">
      {Array.from({ length: columns }, (_, col) => (
        <td key={col} className="px-4 py-4">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  ));

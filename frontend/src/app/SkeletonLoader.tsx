"use client";

export function SkeletonRow() {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
      </td>
      <td className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
      </td>
      <td className="p-4 border-b text-center">
        <div className="flex gap-2 justify-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </td>
    </tr>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </tbody>
  );
}

export function SkeletonSearchBar() {
  return (
    <div className="p-4 bg-white border-b">
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-40"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
    </div>
  );
}

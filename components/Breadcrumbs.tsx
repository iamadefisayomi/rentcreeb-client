import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type PropsCrumbs = {
  label: string;
  index: number;
};

export default function BreadcrumbHeader({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname(); // Fix: Get the current path

  // Function to format breadcrumb labels
  const formatLabel = (segment: string) => {
    return segment
      .replace(/[-_]/g, " ") // Replace hyphens/underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Generate breadcrumbs from pathname
  const crumbs: PropsCrumbs[] = useMemo(() => {
    const pathWithoutQuery = pathname.split("?")[0];
    const pathSegments = pathWithoutQuery.split("/").filter(Boolean);

    return [{ label: "Home", index: 0 }, ...pathSegments.map((segment, i) => ({ label: formatLabel(segment), index: i + 1 }))];
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList className={`text-xs capitalize ${className}`}>
        {crumbs.map((crumb, index) => (
          <BreadcrumbItem key={index} className="flex">
            {/* Last breadcrumb is inactive */}
            <span
              onClick={index === crumbs.length - 1 ? undefined : () => router.push(`/${crumbs.slice(1, index + 1).map((c) => c.label.toLowerCase()).join("/")}`)}
              className={cn("cursor-pointer text-inherit", index == crumbs.length - 1 ? "text-muted cursor-default" : "hover:underline")}
            >
              {crumb.label}
            </span>
            {index !== crumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="w-4" />
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

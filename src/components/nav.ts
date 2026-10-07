import { CalendarDays, FolderKanban, Images, Lightbulb, Rows3, type LucideIcon, Settings, LayoutDashboard } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { key: string; label?: string; items: NavItem[] };

/** Kept deliberately small. All Content, Campaigns and Analytics still exist at their URLs, just not in the way. */
export const NAV: NavGroup[] = [
  { key: "main", items: [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/board", label: "Content Board", icon: FolderKanban },
    { href: "/content", label: "All content", icon: Rows3 },
    { href: "/ideas", label: "Ideas & hooks", icon: Lightbulb },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/library", label: "Library", icon: Images },
    { href: "/settings", label: "Settings", icon: Settings },
  ] },
];

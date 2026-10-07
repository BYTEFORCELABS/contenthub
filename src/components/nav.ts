import { BarChart3, CalendarDays, FolderKanban, Images, Lightbulb, type LucideIcon, Megaphone, Settings, LayoutDashboard, Rows3 } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { key: string; label?: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  { key: "main", items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  { key: "content", label: "Content", items: [
    { href: "/content", label: "All Content", icon: Rows3 },
    { href: "/board", label: "Content Board", icon: FolderKanban },
    { href: "/ideas", label: "Ideas", icon: Lightbulb },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
  ] },
  { key: "plan", items: [
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/library", label: "Content Library", icon: Images },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ] },
];

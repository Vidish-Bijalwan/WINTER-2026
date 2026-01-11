import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Menu,
  X,
  Database,
  BarChart3,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronRight as BreadcrumbSeparator,
  Bell,
  Search,
  ChevronDown,
  Layers,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { NotificationsPopover } from "./NotificationsPopover";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./theme/ThemeToggle";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/monitor", label: "Monitor", icon: Activity },
  { path: "/sources", label: "Data Sources", icon: Database },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/visualizations", label: "Visualizations", icon: BarChart3 },
  { path: "/geography", label: "Geography", icon: Globe },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Navigation({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [alertCount] = useState(3);

  const currentUser = getCurrentUser();
  const userInitials = currentUser ? currentUser.username.slice(0, 2).toUpperCase() : "JD";

  // Auto-retract sidebar when clicking outside (on main content)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-nav');
      const toggleBtn = document.getElementById('sidebar-toggle');

      // If sidebar is expanded and click is NOT on sidebar or toggle button
      if (!isSidebarCollapsed &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(event.target as Node)) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarCollapsed, setSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate("/login");
  };

  // Generate breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, label };
  });

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          <span className="font-bold">TopoForge</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <motion.nav
        id="sidebar-nav"
        initial={false}
        animate={{ width: isSidebarCollapsed ? "80px" : "280px" }}
        className={cn(
          "hidden md:flex fixed left-0 top-0 bottom-0 bg-background/95 backdrop-blur-md border-r border-border z-40 flex-col transition-all duration-300",
          className
        )}
      >
        {/* Header */}
        <div className={cn("p-6 flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          {!isSidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center overflow-hidden">
                <Layers className="w-4 h-4 text-primary-foreground relative z-10" />
              </div>
              <span className="font-bold text-lg">TopoForge</span>
            </Link>
          )}
          <Button id="sidebar-toggle" variant="ghost" size="icon" onClick={toggleSidebar} className="h-6 w-6">
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isSidebarCollapsed && "justify-center px-2"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer / User */}
        <div className="p-4 border-t border-border">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {userInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{currentUser?.username || "Guest"}</span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold cursor-pointer" title={currentUser?.username}>
                {userInitials}
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Breadcrumbs (Desktop Top Bar) */}
      <div className={cn(
        "hidden md:flex fixed top-0 right-0 h-16 items-center justify-between px-8 border-b border-border/50 bg-background/80 backdrop-blur-xl z-30 transition-all duration-300",
        isSidebarCollapsed ? "left-[80px]" : "left-[280px]"
      )}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {breadcrumbs.map((crumb) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <BreadcrumbSeparator className="w-4 h-4" />
              <Link to={crumb.path} className={cn("hover:text-foreground", location.pathname === crumb.path && "text-foreground font-medium")}>
                {crumb.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
              <Search className="w-4 h-4" />
            </Button>
            <span data-tour="theme-toggle">
              <ThemeToggle />
            </span>
            <CommandPalette />
          </div>
          <NotificationsPopover />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-background border-b border-border z-40"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-3 px-4" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;

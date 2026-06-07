"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Trophy, Calendar, Users, Circle as HelpCircle, ChartBar as BarChart3, Image, Star, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Обзор", icon: LayoutDashboard },
  { href: "/rating", label: "Рейтинг", icon: Trophy },
  { href: "/tournaments", label: "Турниры", icon: Calendar },
  { href: "/teams", label: "Команды", icon: Users },
  { href: "/questions", label: "Вопросы", icon: HelpCircle },
  { href: "/statistics", label: "Статистика", icon: BarChart3 },
  { href: "/gallery", label: "Галерея", icon: Image },
  { href: "/hall-of-fame", label: "Зал славы", icon: Star },
  { href: "/admin", label: "Админ", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 ease-in-out glass-sidebar shadow-glass",
          collapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-16 px-3 border-b border-border/60", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">Z</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sm leading-none text-foreground">Zakovat</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">by LRC Studio</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="size-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-border/60">
          <button
            onClick={onToggle}
            className={cn(
              "hidden md:flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" /><span className="text-xs">Свернуть</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Menu className="size-5" />
    </button>
  );
}

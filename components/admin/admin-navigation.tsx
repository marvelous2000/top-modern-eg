"use client";

import { useEffect, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Sun, Menu } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { logout } from "@/app/admin/login/actions";
import { PageTitle } from "./PageTitle";

interface AdminNavigationProps {
  onMenuClick?: () => void;
}

export function AdminNavigation({ onMenuClick }: AdminNavigationProps) {
  const [userName, setUserName] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select(`full_name, email`)
          .eq("id", user.id)
          .single();
        setUserName(profile?.full_name || profile?.email || "Admin");
      }
    };
    fetchUser();
  }, [supabase]);

  const toggleTheme = () => {
    console.log("Theme toggle clicked! Current theme:", theme); // Diagnostic log
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-charcoal-950 px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Suspense fallback={<h1 className="text-lg font-semibold md:text-xl font-serif">Dashboard</h1>}>
          <PageTitle />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {userName ? userName.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Logged in as
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {userName}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
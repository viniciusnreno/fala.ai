"use client";

import { useTheme } from "@/app/providers";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
      <Moon className="h-4 w-4" />
    </div>
  );
}



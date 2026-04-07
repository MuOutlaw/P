import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const navLinks = [
  { label: "الرئيسية", href: "#" },
  { label: "الفئات", href: "#categories" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "المميزات", href: "#features" },
];

function UserMenu() {
  const user = useQuery(api.users.getCurrentUser, {});
  const { removeUser } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Skeleton className="w-8 h-8 rounded-full" />;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "م";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name ?? ""} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span className="hidden md:block text-sm font-medium text-foreground max-w-[100px] truncate">
            {user.name ?? "مستخدم"}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <div className="px-3 py-2">
          <p className="font-semibold text-sm truncate">{user.name ?? "مستخدم"}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email ?? ""}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => navigate("/profile")}
        >
          <User className="w-4 h-4" />
          ملفي الشخصي
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => navigate("/profile/edit")}
        >
          <Settings className="w-4 h-4" />
          إعدادات الحساب
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={() => removeUser()}
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ص</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg text-primary leading-none">الصفاة</span>
              <span className="text-[10px] text-muted-foreground leading-none">Al-Safah Marketplace</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            <AuthLoading>
              <Skeleton className="w-24 h-9 rounded-md" />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton>
                <Button variant="ghost" size="sm" className="font-medium">
                  تسجيل الدخول
                </Button>
              </SignInButton>
              <SignInButton>
                <Button size="sm" className="font-semibold">
                  انضم الآن
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <Button size="sm" className="font-semibold" onClick={() => {}}>
                + نشر إعلان
              </Button>
              <UserMenu />
            </Authenticated>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-foreground cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary py-1 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Unauthenticated>
                  <SignInButton>
                    <Button variant="ghost" size="sm" className="flex-1 font-medium">
                      تسجيل الدخول
                    </Button>
                  </SignInButton>
                  <SignInButton>
                    <Button size="sm" className="flex-1 font-semibold">
                      انضم الآن
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button size="sm" className="flex-1 font-semibold">
                    + نشر إعلان
                  </Button>
                </Authenticated>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

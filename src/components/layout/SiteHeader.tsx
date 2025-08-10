import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import React from "react";

export function SiteHeader(): JSX.Element {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] supports-[backdrop-filter]:bg-[color-mix(in_oklab,hsl(var(--background))_92%,white)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl h-[56px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="font-medium tracking-tight text-[hsl(var(--text-strong))] truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-a))] rounded-sm">
            iSystem Training
          </Link>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="secondaryOutline"
                size="sm"
                onClick={() => navigate("/my-registrations")}
                aria-label="Go to My Registrations"
              >
                My Registrations
              </Button>
              {isAdmin && (
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  aria-label="Open Admin Dashboard"
                >
                  Admin Dashboard
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="secondaryOutline"
              size="sm"
              onClick={() => navigate("/auth")}
              aria-label="Admin Login"
            >
              Admin Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import {
  BookMarked,
  Bookmark as BookmarkIcon,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  Swords,
  User,
} from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/puter/ai';
import { PuterUser } from '@/lib/types';
import { Button } from '../ui/button';

interface HeaderProps {
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  isArenaOpen: boolean;
  onToggleArena: () => void;
  onOpenVault: () => void;
  onOpenBookmarks: () => void;
  user: PuterUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onToggleMobileSidebar: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModel,
  onSelectModel,
  isArenaOpen,
  onToggleArena,
  onOpenVault,
  onOpenBookmarks,
  user,
  onSignIn,
  onSignOut,
  onToggleMobileSidebar,
  theme,
  onToggleTheme,
}) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const activeModelObj =
    AVAILABLE_MODELS.find((m) => m.id === activeModel) || AVAILABLE_MODELS[0];

  return (
    <header className="h-14 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between select-none z-20">
      {/* Left: Mobile Toggle & Model Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground p-1"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/40 hover:bg-muted text-xs font-mono border border-border/80 rounded-sm transition-colors text-foreground"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block" />
            <span className="font-semibold">{activeModelObj.name}</span>
            <span className="text-muted-foreground text-[10px] hidden sm:inline">
              ({activeModelObj.provider})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {isModelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsModelDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-card border border-border shadow-xl rounded-sm z-50 py-1 divide-y divide-border/40 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Select Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                      activeModel === model.id ? 'bg-muted/40 border-l-2 border-editorial-bronze' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-foreground">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="text-[9px] font-mono text-editorial-bronze uppercase px-1 py-0.2 bg-editorial-bronze/10 border border-editorial-bronze/30 rounded-sm">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-sans">
                      {model.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Arena, Vault, Bookmarks, Theme, Puter Auth */}
      <div className="flex items-center gap-2">
        {/* Model Arena Toggle */}
        <Button
          variant={isArenaOpen ? 'editorial' : 'outline'}
          size="sm"
          onClick={onToggleArena}
          className="flex items-center gap-1.5"
          title="Open Model Arena"
        >
          <Swords className="w-3.5 h-3.5 text-editorial-bronze" />
          <span className="hidden sm:inline">Arena</span>
        </Button>

        {/* Prompt Vault Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenVault}
          className="flex items-center gap-1.5"
          title="Open Prompt Vault"
        >
          <BookMarked className="w-3.5 h-3.5 text-editorial-bronze" />
          <span className="hidden md:inline">Vault</span>
        </Button>

        {/* Bookmarks Drawer Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenBookmarks}
          className="flex items-center gap-1.5"
          title="View Saved Bookmarks"
        >
          <BookmarkIcon className="w-3.5 h-3.5 text-editorial-bronze" />
          <span className="hidden md:inline">Bookmarks</span>
        </Button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:bg-muted/50 rounded-sm"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Warm Alabaster' : 'Switch to Obsidian Dark'}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Puter Auth */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 hover:bg-muted border border-border/80 text-xs font-mono rounded-sm transition-colors text-foreground"
              >
                <User className="w-3.5 h-3.5 text-editorial-bronze" />
                <span className="max-w-[100px] truncate">{user.username}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 bg-card border border-border shadow-xl rounded-sm z-50 py-1 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-border/40">
                      <div className="text-[10px] font-mono uppercase text-muted-foreground">
                        Puter Account
                      </div>
                      <div className="text-xs font-mono font-semibold text-foreground truncate">
                        {user.username}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-muted/50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onSignIn}
              className="flex items-center gap-1.5 text-xs font-mono"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Puter</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};


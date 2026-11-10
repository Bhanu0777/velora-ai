import React, { useState } from 'react';
import {
  BookMarked,
  Bookmark as BookmarkIcon,
  ChevronDown,
  Compass,
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

interface RefinedHeaderProps {
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  isArenaOpen: boolean;
  onToggleArena: () => void;
  onOpenVault: () => void;
  onOpenBookmarks: () => void;
  onOpenLanding: () => void;
  user: PuterUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onToggleMobileSidebar: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeConversationTitle?: string;
}

export const RefinedHeader: React.FC<RefinedHeaderProps> = ({
  activeModel,
  onSelectModel,
  isArenaOpen,
  onToggleArena,
  onOpenVault,
  onOpenBookmarks,
  onOpenLanding,
  user,
  onSignIn,
  onSignOut,
  onToggleMobileSidebar,
  theme,
  onToggleTheme,
  activeConversationTitle,
}) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const activeModelObj =
    AVAILABLE_MODELS.find((m) => m.id === activeModel) || AVAILABLE_MODELS[0];

  return (
    <header className="h-14 border-b border-velora-border bg-velora-surface/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-20">
      {/* Left: Mobile hamburger & Active Title / Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-velora-textMuted hover:text-velora-text p-1"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Conversation Breadcrumb */}
        <div className="flex items-center gap-2 truncate">
          <span className="text-[10px] font-mono uppercase text-velora-copper font-semibold tracking-wider hidden sm:inline">
            Chronicle
          </span>
          <span className="text-velora-border hidden sm:inline">•</span>
          <span className="font-serif text-[13.5px] text-velora-text truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {activeConversationTitle || 'Workspace Overview'}
          </span>
        </div>
      </div>

      {/* Right Tools: Model Selector, Arena, Vault, Bookmarks, Theme, Puter */}
      <div className="flex items-center gap-2">
        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-velora-elevated hover:bg-velora-elevated/80 text-xs font-mono border border-velora-border hover:border-velora-copper/50 rounded-xs transition-colors text-velora-text"
          >
            <span className="w-1.5 h-1.5 bg-velora-sage rounded-none inline-block" />
            <span className="font-medium text-[11px]">{activeModelObj.name}</span>
            <ChevronDown className="w-3 h-3 text-velora-textMuted" />
          </button>

          {isModelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsModelDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-64 bg-velora-elevated border border-velora-border shadow-2xl rounded-xs z-50 py-1 divide-y divide-velora-border/60 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-velora-textMuted">
                  Switch Active Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-velora-surface transition-colors ${
                      activeModel === model.id ? 'bg-velora-surface border-l-2 border-velora-copper' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-velora-text">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="text-[9px] font-mono text-velora-copper uppercase px-1 py-0.2 bg-velora-copper/10 border border-velora-copper/30 rounded-xs">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-velora-textMuted line-clamp-1 mt-0.5">
                      {model.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Model Arena */}
        <button
          onClick={onToggleArena}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-xs border transition-all ${
            isArenaOpen
              ? 'bg-velora-copper text-white border-velora-copper font-medium shadow-sm'
              : 'bg-velora-surface hover:bg-velora-elevated text-velora-text border-velora-border hover:border-velora-copper/50'
          }`}
          title="Toggle Model Arena Duel"
        >
          <Swords className={`w-3.5 h-3.5 ${isArenaOpen ? 'text-white' : 'text-velora-copper'}`} />
          <span className="hidden sm:inline text-[11px]">Arena</span>
        </button>

        {/* Prompt Vault */}
        <button
          onClick={onOpenVault}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono bg-velora-surface hover:bg-velora-elevated text-velora-text border border-velora-border hover:border-velora-copper/50 rounded-xs transition-colors"
          title="Open Prompt Vault (⌘V)"
        >
          <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
          <span className="text-[11px]">Vault</span>
        </button>

        {/* Bookmarks */}
        <button
          onClick={onOpenBookmarks}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono bg-velora-surface hover:bg-velora-elevated text-velora-text border border-velora-border hover:border-velora-copper/50 rounded-xs transition-colors"
          title="Saved Reflections (⌘B)"
        >
          <BookmarkIcon className="w-3.5 h-3.5 text-velora-copper" />
          <span className="text-[11px]">Bookmarks</span>
        </button>

        {/* Manifesto / Product Tour */}
        <button
          onClick={onOpenLanding}
          className="p-1.5 text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated border border-transparent hover:border-velora-border rounded-xs transition-colors"
          title="Product Manifesto"
        >
          <Compass className="w-3.5 h-3.5 text-velora-sage" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated border border-velora-border/80 rounded-xs transition-colors"
          aria-label="Toggle color theme"
          title={theme === 'dark' ? 'Switch to Alabaster Light' : 'Switch to Obsidian Dark'}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-velora-textMuted" />
          )}
        </button>

        {/* Puter Account Authentication */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-velora-elevated hover:bg-velora-elevated/80 border border-velora-border text-xs font-mono rounded-xs transition-colors text-velora-text"
              >
                <User className="w-3.5 h-3.5 text-velora-copper" />
                <span className="max-w-[85px] truncate text-[11px]">{user.username}</span>
                <ChevronDown className="w-3 h-3 text-velora-textMuted" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-48 bg-velora-elevated border border-velora-border shadow-2xl rounded-xs z-50 py-1 divide-y divide-velora-border/60 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-2">
                      <div className="text-[9px] font-mono uppercase text-velora-textMuted">
                        Puter Cloud Identity
                      </div>
                      <div className="text-xs font-mono font-semibold text-velora-text truncate">
                        {user.username}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-velora-surface flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Puter</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.98] text-white text-xs font-mono font-medium rounded-xs transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="text-[11px]">Connect Puter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

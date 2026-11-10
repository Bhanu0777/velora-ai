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
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-20">
      {/* Left: Mobile hamburger & Active Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-velora-textMuted hover:text-velora-text p-1"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Conversation Title */}
        <span className="font-serif text-[14px] text-velora-text truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          {activeConversationTitle || 'New Conversation'}
        </span>
      </div>

      {/* Right Tools: Model Selector, Arena, Vault, Bookmarks, Theme, Puter */}
      <div className="flex items-center gap-1.5">
        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
          >
            <span className="w-1.5 h-1.5 bg-velora-copper rounded-full inline-block" />
            <span className="font-medium text-[12px]">{activeModelObj.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isModelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsModelDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-[#14161A] border border-white/10 shadow-2xl rounded-xl z-50 py-1.5 divide-y divide-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-velora-textMuted/50">
                  Select Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2 cursor-pointer hover:bg-white/[0.04] transition-colors ${
                      activeModel === model.id ? 'bg-white/[0.06] text-white' : 'text-velora-textMuted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-velora-text">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="text-[9px] font-mono text-velora-copper uppercase px-1.5 py-0.5 bg-velora-copper/10 rounded-full">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-velora-textMuted/60 line-clamp-1 mt-0.5 font-sans">
                      {model.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Model Arena Button */}
        <button
          onClick={onToggleArena}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all ${
            isArenaOpen
              ? 'bg-velora-copper text-white font-medium shadow-sm'
              : 'text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06]'
          }`}
          title="Toggle Model Arena Duel"
        >
          <Swords className={`w-3.5 h-3.5 ${isArenaOpen ? 'text-white' : 'text-velora-copper'}`} />
          <span className="hidden sm:inline text-[12px]">Arena</span>
        </button>

        {/* Prompt Vault Button */}
        <button
          onClick={onOpenVault}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
          title="Open Prompt Vault"
        >
          <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
          <span className="text-[12px]">Vault</span>
        </button>

        {/* Bookmarks Button */}
        <button
          onClick={onOpenBookmarks}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
          title="Saved Reflections"
        >
          <BookmarkIcon className="w-3.5 h-3.5 text-velora-copper" />
          <span className="text-[12px]">Saved</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-velora-textMuted hover:text-velora-text hover:bg-white/[0.04] rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-velora-textMuted" />
          )}
        </button>

        {/* Puter Account Authentication */}
        <div className="relative ml-1">
          {user ? (
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-text bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-colors"
              >
                <User className="w-3.5 h-3.5 text-velora-copper" />
                <span className="max-w-[80px] truncate text-[11px]">{user.username}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#14161A] border border-white/10 shadow-2xl rounded-xl z-50 py-1.5 divide-y divide-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3.5 py-2">
                      <div className="text-[10px] font-mono uppercase text-velora-textMuted/50">
                        Signed In
                      </div>
                      <div className="text-xs font-semibold text-velora-text truncate">
                        {user.username}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-white/[0.04] flex items-center gap-2 transition-colors"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-velora-copper hover:bg-velora-copperLight active:scale-95 text-white text-xs font-medium rounded-full transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Puter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookMarked, Plus, Search, Sparkles, X, Check } from 'lucide-react';
import { PromptTemplate } from '@/lib/types';
import { Button } from '../ui/button';

interface PromptVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vault: PromptTemplate[];
  onSelectPrompt: (filledPrompt: string) => void;
  onSaveNewTemplate: (template: PromptTemplate) => void;
}

export const PromptVaultModal: React.FC<PromptVaultModalProps> = ({
  isOpen,
  onClose,
  vault,
  onSelectPrompt,
  onSaveNewTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Variable filling state
  const [fillingTemplate, setFillingTemplate] = useState<PromptTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // New prompt template form state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Strategy' | 'Code' | 'Writing' | 'Analysis' | 'Systems'>('Strategy');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');

  const categories = ['All', 'Strategy', 'Code', 'Writing', 'Analysis', 'Systems'];

  const filteredVault = vault.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartFill = (template: PromptTemplate) => {
    if (template.variables.length === 0) {
      onSelectPrompt(template.prompt);
      onClose();
      return;
    }
    setFillingTemplate(template);
    const initialVars: Record<string, string> = {};
    template.variables.forEach((v) => (initialVars[v] = ''));
    setVariableValues(initialVars);
  };

  const handleApplyFilledPrompt = () => {
    if (!fillingTemplate) return;
    let finalPrompt = fillingTemplate.prompt;
    for (const [key, val] of Object.entries(variableValues)) {
      finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val.trim() || `[${key}]`);
    }
    onSelectPrompt(finalPrompt);
    setFillingTemplate(null);
    onClose();
  };

  const handleCreateTemplate = () => {
    if (!newTitle.trim() || !newPromptText.trim()) return;
    
    // Automatically extract {{variable}} patterns
    const matches = Array.from(newPromptText.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g));
    const extractedVars = Array.from(new Set(matches.map((m) => m[1])));

    const newTemplate: PromptTemplate = {
      id: 'custom_' + Date.now().toString(36),
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || undefined,
      prompt: newPromptText.trim(),
      variables: extractedVars,
      createdAt: Date.now(),
      isCustom: true,
    };

    onSaveNewTemplate(newTemplate);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewDescription('');
    setNewPromptText('');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-card border border-border p-6 shadow-2xl rounded-sm z-50 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/80 select-none">
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-editorial-bronze" />
              <div>
                <h2 className="font-serif text-lg text-foreground tracking-tight">Prompt Vault</h2>
                <p className="text-xs text-muted-foreground font-sans">
                  Curate, parameterize, and deploy reusable analytical frameworks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isCreatingNew ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => {
                  setIsCreatingNew(!isCreatingNew);
                  setFillingTemplate(null);
                }}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingNew ? 'View Vault' : 'New Prompt'}</span>
              </Button>
              <Dialog.Close asChild>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {isCreatingNew ? (
              /* Create Template Form */
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <h3 className="font-serif text-base text-foreground">Save Reusable Prompt</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Competitive Vulnerability Analysis"
                      className="w-full bg-muted/30 border border-border px-3 py-2 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-muted/30 border border-border px-3 py-2 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                    Short Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Brief summary of when to use this prompt..."
                    className="w-full bg-muted/30 border border-border px-3 py-2 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-muted-foreground block">
                      Prompt Text
                    </label>
                    <span className="text-[10px] font-mono text-editorial-bronze">
                      Tip: Use {'{{variable_name}}'} for dynamic inputs
                    </span>
                  </div>
                  <textarea
                    value={newPromptText}
                    onChange={(e) => setNewPromptText(e.target.value)}
                    placeholder="Provide the exact prompt instructions. Include {{placeholders}} where appropriate..."
                    rows={6}
                    className="w-full bg-muted/30 border border-border p-3 text-xs font-mono leading-relaxed rounded-sm outline-none focus:border-editorial-bronze resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreatingNew(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCreateTemplate}
                    disabled={!newTitle.trim() || !newPromptText.trim()}
                  >
                    Save into Vault
                  </Button>
                </div>
              </div>
            ) : fillingTemplate ? (
              /* Variable Substitution View */
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <div className="border-b border-border/60 pb-3">
                  <span className="text-[10px] font-mono uppercase text-editorial-bronze">
                    {fillingTemplate.category}
                  </span>
                  <h3 className="font-serif text-base text-foreground mt-0.5">
                    {fillingTemplate.title}
                  </h3>
                  {fillingTemplate.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {fillingTemplate.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-muted-foreground block">
                    Configure Template Variables:
                  </label>
                  {fillingTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <span className="text-xs font-mono text-foreground mb-1 block">
                        {`{{${variable}}}`}
                      </span>
                      <input
                        type="text"
                        value={variableValues[variable] || ''}
                        onChange={(e) =>
                          setVariableValues({ ...variableValues, [variable]: e.target.value })
                        }
                        placeholder={`Enter ${variable.replace(/_/g, ' ')}...`}
                        className="w-full bg-muted/30 border border-border px-3 py-2 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
                        autoFocus={fillingTemplate.variables[0] === variable}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFillingTemplate(null)}
                  >
                    Back to List
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApplyFilledPrompt}
                    className="flex items-center gap-1.5"
                  >
                    <span>Insert into Conversation</span>
                    <Sparkles className="w-3.5 h-3.5 text-editorial-bronze" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Template Directory List */
              <div className="space-y-4">
                {/* Search & Category Pills */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search frameworks by title, description or prompt..."
                      className="w-full bg-muted/30 border border-border pl-8 pr-3 py-1.5 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
                    />
                  </div>

                  {/* Category filters */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-foreground text-background font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {filteredVault.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleStartFill(item)}
                      className="p-4 bg-muted/20 hover:bg-muted/40 border border-border/80 hover:border-editorial-bronze/60 transition-all rounded-sm cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1.5">
                          <span className="text-editorial-bronze font-semibold">
                            {item.category}
                          </span>
                          {item.variables.length > 0 && (
                            <span className="text-muted-foreground/80">
                              {item.variables.length} var{item.variables.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-editorial-bronze transition-colors">
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground/80">
                        <span className="truncate max-w-[200px]">
                          {item.prompt.slice(0, 40)}...
                        </span>
                        <span className="text-editorial-bronze group-hover:translate-x-0.5 transition-transform">
                          Use ↵
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredVault.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-muted-foreground font-serif text-sm">
                      No prompt frameworks matched your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


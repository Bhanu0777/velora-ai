import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookMarked, Plus, Search, Sparkles, X, ArrowRight, Layers } from 'lucide-react';
import { PromptTemplate } from '@/lib/types';

interface RefinedPromptVaultProps {
  isOpen: boolean;
  onClose: () => void;
  vault: PromptTemplate[];
  onSelectPrompt: (filledPrompt: string) => void;
  onSaveNewTemplate: (template: PromptTemplate) => void;
}

export const RefinedPromptVault: React.FC<RefinedPromptVaultProps> = ({
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
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-velora-surface border border-velora-border p-6 shadow-2xl rounded-xs z-50 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[85vh] flex flex-col select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-velora-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-velora-elevated border border-velora-border flex items-center justify-center text-velora-copper">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-velora-text tracking-tight">Prompt Vault</h2>
                <p className="text-xs text-velora-textMuted font-sans">
                  Deploy parameterized analytical frameworks and editorial prompts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsCreatingNew(!isCreatingNew);
                  setFillingTemplate(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-velora-elevated hover:bg-velora-elevated/80 text-velora-text border border-velora-border rounded-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingNew ? 'Browse Vault' : 'New Framework'}</span>
              </button>
              <Dialog.Close asChild>
                <button
                  className="text-velora-textMuted hover:text-velora-text transition-colors p-1"
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
                <h3 className="font-serif text-base text-velora-text">Save New Framework</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-velora-textMuted block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Failure Mode Matrix"
                      className="w-full bg-velora-elevated border border-velora-border px-3 py-2 text-xs font-sans rounded-xs outline-none focus:border-velora-copper text-velora-text"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-velora-textMuted block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-velora-elevated border border-velora-border px-3 py-2 text-xs font-sans rounded-xs outline-none focus:border-velora-copper text-velora-text"
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
                  <label className="text-[10px] font-mono uppercase text-velora-textMuted block mb-1">
                    Short Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Context for when to deploy this framework..."
                    className="w-full bg-velora-elevated border border-velora-border px-3 py-2 text-xs font-sans rounded-xs outline-none focus:border-velora-copper text-velora-text"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono uppercase text-velora-textMuted block">
                      Prompt Structure
                    </label>
                    <span className="text-[9px] font-mono text-velora-copper">
                      Tip: Use {'{{var_name}}'} for parameter placeholders
                    </span>
                  </div>
                  <textarea
                    value={newPromptText}
                    onChange={(e) => setNewPromptText(e.target.value)}
                    placeholder="Enter instructions. Use {{variable_name}} for dynamic slots..."
                    rows={6}
                    className="w-full bg-velora-elevated border border-velora-border p-3 text-xs font-mono leading-relaxed rounded-xs outline-none focus:border-velora-copper text-velora-text resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsCreatingNew(false)}
                    className="px-3 py-1.5 text-xs font-mono text-velora-textMuted hover:text-velora-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTemplate}
                    disabled={!newTitle.trim() || !newPromptText.trim()}
                    className="px-4 py-1.5 text-xs font-mono font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-xs disabled:opacity-40 transition-colors shadow-sm"
                  >
                    Save into Vault
                  </button>
                </div>
              </div>
            ) : fillingTemplate ? (
              /* Variable Parameter Input View */
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <div className="border-b border-velora-border pb-3">
                  <span className="text-[10px] font-mono uppercase text-velora-copper">
                    {fillingTemplate.category}
                  </span>
                  <h3 className="font-serif text-base text-velora-text mt-0.5">
                    {fillingTemplate.title}
                  </h3>
                  {fillingTemplate.description && (
                    <p className="text-xs text-velora-textMuted mt-1">
                      {fillingTemplate.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase text-velora-textMuted block">
                    Supply Template Parameters:
                  </label>
                  {fillingTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <span className="text-xs font-mono text-velora-copperLight mb-1 block">
                        {`{{${variable}}}`}
                      </span>
                      <input
                        type="text"
                        value={variableValues[variable] || ''}
                        onChange={(e) =>
                          setVariableValues({ ...variableValues, [variable]: e.target.value })
                        }
                        placeholder={`Enter ${variable.replace(/_/g, ' ')}...`}
                        className="w-full bg-velora-elevated border border-velora-border px-3 py-2 text-xs font-sans rounded-xs outline-none focus:border-velora-copper text-velora-text"
                        autoFocus={fillingTemplate.variables[0] === variable}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-velora-border">
                  <button
                    onClick={() => setFillingTemplate(null)}
                    className="px-3 py-1.5 text-xs font-mono text-velora-textMuted hover:text-velora-text"
                  >
                    Back to List
                  </button>

                  <button
                    onClick={handleApplyFilledPrompt}
                    className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-xs transition-colors shadow-sm"
                  >
                    <span>Insert into Conversation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Framework Directory */
              <div className="space-y-4">
                {/* Search & Categories */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-velora-border">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-velora-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search frameworks by title, description or prompt..."
                      className="w-full bg-velora-elevated border border-velora-border pl-8 pr-3 py-1.5 text-xs font-sans rounded-xs outline-none focus:border-velora-copper text-velora-text"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-velora-text text-velora-bg font-semibold'
                            : 'text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Framework Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {filteredVault.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleStartFill(item)}
                      className="p-4 bg-velora-elevated/40 hover:bg-velora-elevated border border-velora-border hover:border-velora-copper/60 transition-all rounded-xs cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1.5">
                          <span className="text-velora-copper font-medium">
                            {item.category}
                          </span>
                          {item.variables.length > 0 && (
                            <span className="text-velora-textMuted">
                              {item.variables.length} slot{item.variables.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-sm font-semibold text-velora-text group-hover:text-velora-copperLight transition-colors">
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-xs text-velora-textMuted mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-velora-border/60 flex items-center justify-between text-[11px] font-mono text-velora-textMuted">
                        <span className="truncate max-w-[200px] text-[10px]">
                          {item.prompt.slice(0, 36)}...
                        </span>
                        <span className="text-velora-copper font-medium group-hover:translate-x-0.5 transition-transform">
                          Deploy ↵
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredVault.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-velora-textMuted font-serif text-sm">
                      No frameworks matched your filter criteria.
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


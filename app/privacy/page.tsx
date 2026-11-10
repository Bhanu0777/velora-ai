import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 selection:bg-editorial-bronze selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors border border-border/70 hover:border-editorial-bronze px-2.5 py-1 rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-editorial-bronze text-xs font-mono uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>Governance & Confidentiality</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: November 2026 • Document Version 1.0.0
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed font-sans space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">1. Foundational Architecture & Philosophy</h2>
            <p>
              VELORA is designed under a <strong>zero-central-database, privacy-first paradigm</strong>. We do not operate proprietary tracking clusters, analytics trackers, or centralized SQL databases harvesting your conversation transcripts. Your reflections, analytical branches, and prompt vault templates exist either locally within your client browser environment or inside your personal, authenticated Puter cloud storage container.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">2. Client-Side Persistence vs. Cloud Synchronization</h2>
            <p>
              <strong>Anonymous Sessions:</strong> When you use VELORA without authenticating, 100% of your data (conversation trees, bookmarks, and custom prompts) remains strictly in your browser's local sandbox (LocalStorage/IndexedDB). No telemetry or conversational logs are transmitted to external servers.
            </p>
            <p>
              <strong>Puter Account Synchronization:</strong> When you voluntarily connect your Puter account, data persistence is delegated exclusively to your user-isolated Puter Key-Value Store (<code className="text-xs font-mono bg-muted px-1 py-0.5 rounded-sm">puter.kv</code>). VELORA does not hold decryption keys or intermediate storage servers between your browser and Puter.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">3. Processing of Prompts by AI Foundation Models</h2>
            <p>
              When you dispatch an inquiry or invoke Model Arena, your prompt context is processed through Puter's unified AI inference API (<code className="text-xs font-mono bg-muted px-1 py-0.5 rounded-sm">puter.ai.chat</code>). The request is proxied directly to the upstream model provider you selected (such as OpenAI, Anthropic, DeepSeek, or Google).
            </p>
            <p>
              Upstream providers process prompts strictly to generate completions in real time. We do not use your proprietary prompts to train foundational AI models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">4. Cookies and Web Storage</h2>
            <p>
              VELORA utilizes modern browser storage APIs strictly for essential utility functions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Local Storage:</strong> Storing active theme preference, offline conversation trees, and prompt vault templates.</li>
              <li><strong>Session Tokens:</strong> Puter authentication session tokens managed through Puter.js.</li>
              <li>We do not deploy third-party advertising cookies, cross-site behavioral fingerprinting, or marketing pixels.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">5. Data Erasure and Portability</h2>
            <p>
              You maintain total dominion over your data. You may delete individual conversation threads, wipe local browser storage at any time via your browser settings, or delete your Puter KV records directly through the Puter dashboard. Deletion from your client or Puter KV is permanent and non-recoverable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">6. Contact & Inquiries</h2>
            <p>
              For privacy governance or architectural audit questions, address inquiries to our engineering team at <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded-sm">privacy@velora.ai</code>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground select-none">
          <span>VELORA Editorial Intelligence</span>
          <Link href="/terms" className="hover:text-foreground underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}


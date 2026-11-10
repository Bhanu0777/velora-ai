import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Operational Agreement</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: November 2026 • Document Version 1.0.0
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed font-sans space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing, installing as a Progressive Web Application (PWA), or utilizing the VELORA software workspace ("the Application"), you agree to be bound by these Terms and Conditions. If you do not accept these terms in their entirety, you must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">2. Description of Service</h2>
            <p>
              VELORA is an intellectual AI chat interface and workbench engineered to interface with multiple foundational large language models via the Puter.js serverless SDK. Features include Conversation Branching, Model Arena comparative duels, Prompt Vault curation, and Answer Controls.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">3. User Conduct and Responsibilities</h2>
            <p>
              You agree not to utilize the Application for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Generating malicious code, exploit payloads, or executing denial-of-service vectors.</li>
              <li>Circumventing safety boundaries or terms established by upstream model providers.</li>
              <li>Violating any applicable national or international laws or proprietary intellectual property protections.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">4. Intellectual Property & Generation Rights</h2>
            <p>
              <strong>Your Prompts and Insights:</strong> You retain full title and ownership over the original prompts, reflections, custom prompt vault templates, and personal notes you author in VELORA.
            </p>
            <p>
              <strong>AI Generated Content:</strong> Ownership of AI-generated responses is governed by the respective terms of the foundational model provider utilized (OpenAI, Anthropic, DeepSeek, Google). VELORA claims zero copyright, licensing rights, or commercial royalties over generated outputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">5. Disclaimer of Warranties</h2>
            <p>
              The Application and all AI-generated outputs are provided on an <em>"AS IS"</em> and <em>"AS AVAILABLE"</em> basis without warranty of any kind. AI models may hallucinate, produce erroneous technical logic, or offer incomplete citations. You assume full responsibility for verifying code, architectural patterns, and strategic guidance before deploying to production systems.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">6. Modifications to Service</h2>
            <p>
              We reserve the right to refine or upgrade features, adjust supported model lineups, or introduce structural enhancements at our sole discretion. Continued usage constitutes acceptance of revised terms.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground select-none">
          <span>VELORA Editorial Intelligence</span>
          <Link href="/privacy" className="hover:text-foreground underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

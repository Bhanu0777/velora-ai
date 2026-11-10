import { PromptTemplate } from '../types';

export const INITIAL_PROMPT_VAULT: PromptTemplate[] = [
  {
    id: 'vault_first_principles',
    title: 'First Principles Deconstruction',
    category: 'Strategy',
    description: 'Break down a complex problem into fundamental physics/truths and rebuild upward without assumptions.',
    prompt: `Deconstruct the following problem down to foundational first principles:

Topic/Problem: {{topic}}
Primary Constraint: {{primary_constraint}}

1. Identify and systematically dismantle prevailing industry dogmas or untested conventions around this topic.
2. Isolate the undeniable elemental truths and physical/mathematical facts.
3. Reconstruct a radically clean solution framework from scratch.
4. Detail the asymmetric advantage this architectural view unlocks.`,
    variables: ['topic', 'primary_constraint'],
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'vault_code_architectural_audit',
    title: 'Surgical Architecture & Safety Audit',
    category: 'Code',
    description: 'Rigorously audit an architectural pattern or code snippet for safety, edge cases, and memory/concurrency leaks.',
    prompt: `Conduct a rigorous architectural review and failure mode analysis for the following implementation:

Target System: {{system_description}}
Primary Risk Vector: {{risk_vector}}

Examine:
- Concurrency race conditions and re-entrancy risks
- Failure boundaries, cascading failure modes, and retry safety
- Strict typed invariants and input sanitization
- Zero-cost abstractions and memory footprint
Provide revised, production-grade code that resolves all identified vulnerabilities.`,
    variables: ['system_description', 'risk_vector'],
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
  },
  {
    id: 'vault_socratic_challenger',
    title: 'Socratic Adversarial Critique',
    category: 'Analysis',
    description: 'Stress-test an assumption or business proposal through unrelenting Socratic interrogation.',
    prompt: `Act as an adversarial principal partner stress-testing my proposal:

Proposal: {{proposal}}
Key Assumption: {{key_assumption}}

Challenge this vigorously:
1. Expose hidden operational blind spots and cognitive biases.
2. Outline the exact conditions under which this decision catastrophically fails.
3. Present the steelmanned counter-argument that a fiercest competitor would make.
4. Formulate 3 diagnostic litmus-test questions that must be answered before proceeding.`,
    variables: ['proposal', 'key_assumption'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'vault_editorial_distillation',
    title: 'Executive Editorial Distillation',
    category: 'Writing',
    description: 'Transform verbose technical material into high-density, authoritative editorial prose.',
    prompt: `Synthesize and edit the following technical narrative into an authoritative executive essay:

Raw Material: {{raw_material}}
Target Audience: {{target_audience}}

Guidelines:
- Zero jargon, zero corporate filler, zero buzzwords.
- Precision of diction with strong active verbs and cadence.
- High intellectual density: maximize insights per sentence.
- Format with an arresting opening thesis, 3 decisive structural pillars, and a pragmatic imperative.`,
    variables: ['raw_material', 'target_audience'],
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'vault_system_dynamics',
    title: 'System Dynamics & Feedback Loops',
    category: 'Systems',
    description: 'Map out 2nd and 3rd order unintended consequences, reinforcing feedback loops, and bottlenecks.',
    prompt: `Map the system dynamics and feedback loops for this intervention:

Intervention: {{intervention}}
Time Horizon: {{time_horizon}}

Map:
1. Immediate 1st order intended outcomes.
2. 2nd order systemic compensations and unintended friction.
3. 3rd order equilibrium shifts and potential reinforcing death spirals or flywheels.
4. What high-leverage governor or circuit-breaker should be implemented to maintain stability?`,
    variables: ['intervention', 'time_horizon'],
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
];

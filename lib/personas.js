const PERSONAS = [
  {
    id: "polite",
    name: "Priya",
    title: "Talent Partner",
    tone: "Warm, process-heavy, quietly budget-bound",
    traits: ["polite", "deadline-aware", "budget-conscious"],
    openers: ["Hi {candidate},", "Hope your week is going well, {candidate},"],
    pushbacks: [
      "We're still calibrating the band, but your target is a little above our current model.",
      "The committee is asking for a tighter range before we can move to next steps.",
      "We can get closer, but I need you to show flexibility on the base."
    ],
    followUps: [
      "Just floating this back to the top of your inbox — the window is closing.",
      "I know silence can mean a lot of things, so I'll assume you're still interested?"
    ],
    closers: ["Best,\n{persona}", "Warm regards,\n{persona}"]
  },
  {
    id: "blunt",
    name: "Marcus",
    title: "Senior Recruiter",
    tone: "Direct, deadline-driven, allergic to ambiguity",
    traits: ["blunt", "fast-moving", "numbers-first"],
    openers: ["{candidate},", "Quick one, {candidate},"],
    pushbacks: [
      "Your number is high for this stage, but I can sell it if you move fast.",
      "We have two other candidates in the mix, so I need a firmer position.",
      "If we can't land near band, I'll have to recommend the cheaper option."
    ],
    followUps: [
      "No reply yet — I'm about to mark this as cooling off.",
      "Still in? If not, say so and I'll stop chasing."
    ],
    closers: ["— {persona}", "Regards,\n{persona}"]
  },
  {
    id: "passive",
    name: "Elena",
    title: "Executive Search Associate",
    tone: "Passive-aggressive, vaguely disappointed, strategically vague",
    traits: ["passive-aggressive", "polite-undercurrent", "low-pressure"],
    openers: ["Hi {candidate},", "I hope this finds you well, {candidate},"],
    pushbacks: [
      "I think we could have made this work, but your expectations are a touch above the role.",
      "It's not that we can't meet you there — it's just that the committee is a bit hesitant.",
      "I'd hate for this to fall apart over a number we could have softened."
    ],
    followUps: [
      "I'll keep this warm for now, but I can't promise the door stays open forever.",
      "No rush — I just wanted to make sure you didn't forget us."
    ],
    closers: ["Best,\n{persona}", "Kind regards,\n{persona}"]
  }
];

const DEFAULT_PERSONA_ID = "polite";

function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || PERSONAS[0];
}

function render(template, vars) {
  return template
    .replace(/\{candidate\}/g, vars.candidate)
    .replace(/\{persona\}/g, vars.persona)
    .replace(/\{role\}/g, vars.role)
    .replace(/\{salary\}/g, vars.salary)
    .replace(/\{nonNegotiables\}/g, vars.nonNegotiables);
}

function fatigueLabel(fatigue) {
  const f = Number(fatigue || 0);
  if (f < 25) return "Fresh";
  if (f < 50) return "Cautious";
  if (f < 75) return "Tired";
  return "Blackmail-Ready";
}

function buildVars(persona, state) {
  const candidate = state.candidateName || "Candidate";
  const role = state.role || "the role";
  const salary = state.salaryTarget ? `$${Number(state.salaryTarget).toLocaleString()}` : "your target";
  const nonNegotiables =
    Array.isArray(state.nonNegotiables) && state.nonNegotiables.length
      ? state.nonNegotiables.join(", ")
      : "your non-negotiables";

  return {
    candidate,
    role,
    salary,
    nonNegotiables,
    persona: `${persona.name} ${persona.title}`
  };
}

function generateRecruiterEmail(personaId, state = {}) {
  const persona = getPersona(personaId);
  const vars = buildVars(persona, state);
  const fatigue = Number(state.fatigue || 0);
  const round = Number(state.round || 0);

  const opener = persona.openers[round % persona.openers.length];
  const closer = persona.closers[round % persona.closers.length];
  const pushbackTier = Math.min(persona.pushbacks.length - 1, Math.floor(fatigue / 25));

  const body = [
    render(opener, vars),
    "",
    persona.pushbacks[pushbackTier],
    "",
    render(`We can revisit ${vars.role} if ${vars.salary} and ${vars.nonNegotiables} start to align.`, vars),
    "",
    render(closer, vars)
  ].join("\n");

  return {
    subject: `RE: ${vars.role} — next steps`,
    body,
    persona: persona.id,
    fatigue,
    fatigueLabel: fatigueLabel(fatigue)
  };
}

function generateFollowUp(personaId, state = {}) {
  const persona = getPersona(personaId);
  const vars = buildVars(persona, state);
  const days = Number(state.days || 1);

  const opener = persona.openers[0];
  const closer = persona.closers[0];
  const line = persona.followUps[days % persona.followUps.length];

  const body = [
    render(opener, vars),
    "",
    line,
    "",
    render(closer, vars)
  ].join("\n");

  return {
    subject: `Following up: ${vars.role}`,
    body,
    persona: persona.id
  };
}

module.exports = {
  PERSONAS,
  DEFAULT_PERSONA_ID,
  getPersona,
  fatigueLabel,
  generateRecruiterEmail,
  generateFollowUp
};

module.exports.default = module.exports;
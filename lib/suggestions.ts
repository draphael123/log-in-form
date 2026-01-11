/**
 * Rule-based suggestions engine
 * Generates 3-5 helpful suggestions based on form entry content
 */

type SuggestionEntry = {
  title: string;
  description: string;
  category: string;
};

// Category-specific suggestions
const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  productivity: [
    "Consider breaking this task into smaller, manageable subtasks",
    "Set a specific deadline to maintain accountability",
    "Use time-blocking to dedicate focused hours to this task",
    "Identify potential blockers early and plan workarounds",
    "Review progress at the end of each day",
  ],
  health: [
    "Track your progress with measurable metrics",
    "Set reminders to stay consistent with your routine",
    "Consider consulting a professional for personalized advice",
    "Start with small, sustainable changes",
    "Keep a journal to monitor how you feel over time",
  ],
  admin: [
    "Create a checklist to ensure all requirements are met",
    "Set calendar reminders for important deadlines",
    "Keep digital copies of all relevant documents",
    "Review compliance requirements regularly",
    "Maintain an audit trail for accountability",
  ],
  "customer support": [
    "Respond within 24 hours to maintain customer satisfaction",
    "Document the issue thoroughly for future reference",
    "Escalate complex issues to the appropriate team",
    "Follow up after resolution to ensure satisfaction",
    "Look for patterns to prevent recurring issues",
  ],
  engineering: [
    "Write tests before implementing the fix",
    "Document your changes in the relevant places",
    "Consider the impact on other parts of the system",
    "Review with a colleague before deploying",
    "Monitor after deployment for any regressions",
  ],
  general: [
    "Define clear success criteria for this entry",
    "Set a realistic timeline with milestones",
    "Identify stakeholders who should be informed",
    "Document any assumptions you're making",
    "Plan a review checkpoint to assess progress",
  ],
};

// Keyword-based suggestions
const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  refund: [
    "Verify the refund policy before processing",
    "Document the reason for the refund request",
    "Check if partial refund is appropriate",
    "Update inventory if applicable",
  ],
  shipping: [
    "Confirm the shipping address with the customer",
    "Provide tracking information proactively",
    "Check for any shipping restrictions",
    "Consider expedited shipping if delayed",
  ],
  onboarding: [
    "Create a welcome email or message sequence",
    "Prepare all necessary access credentials",
    "Schedule an introductory call or meeting",
    "Provide links to helpful documentation",
  ],
  schedule: [
    "Block time on the calendar now",
    "Send calendar invites to all participants",
    "Set a reminder 24 hours before",
    "Prepare an agenda in advance",
  ],
  bug: [
    "Reproduce the issue in a controlled environment",
    "Check recent changes that might have caused it",
    "Add logging to gather more information",
    "Create a regression test after fixing",
  ],
  compliance: [
    "Review applicable regulations thoroughly",
    "Document all compliance-related decisions",
    "Schedule regular compliance audits",
    "Consult with legal if uncertain",
  ],
  urgent: [
    "Prioritize this above other tasks immediately",
    "Communicate timeline expectations clearly",
    "Identify resources needed to expedite",
    "Update stakeholders on progress frequently",
  ],
  review: [
    "Prepare all materials before the review",
    "Set clear objectives for the review session",
    "Gather feedback from relevant parties",
    "Document action items from the review",
  ],
  meeting: [
    "Send agenda to participants beforehand",
    "Keep the meeting focused and time-boxed",
    "Document key decisions and action items",
    "Follow up with meeting notes within 24 hours",
  ],
  deadline: [
    "Break down work into daily targets",
    "Identify critical path items",
    "Build in buffer time for unexpected issues",
    "Communicate early if deadline is at risk",
  ],
};

/**
 * Generates 3-5 suggestions based on form entry content
 */
export function getSuggestions(entry: SuggestionEntry): string[] {
  const suggestions: string[] = [];
  const usedSuggestions = new Set<string>();

  const addSuggestion = (suggestion: string) => {
    if (!usedSuggestions.has(suggestion) && suggestions.length < 5) {
      usedSuggestions.add(suggestion);
      suggestions.push(suggestion);
    }
  };

  // Normalize inputs for matching
  const categoryLower = entry.category.toLowerCase();
  const titleLower = entry.title.toLowerCase();
  const descriptionLower = entry.description.toLowerCase();
  const combinedText = `${titleLower} ${descriptionLower}`;

  // 1. Add keyword-based suggestions (check both title and description)
  for (const [keyword, keywordSuggestions] of Object.entries(KEYWORD_SUGGESTIONS)) {
    if (combinedText.includes(keyword)) {
      // Add 1-2 suggestions per matched keyword
      const toAdd = keywordSuggestions.slice(0, 2);
      toAdd.forEach(addSuggestion);
    }
  }

  // 2. Add category-specific suggestions
  const categorySuggestions = CATEGORY_SUGGESTIONS[categoryLower] || CATEGORY_SUGGESTIONS.general;
  
  // Shuffle category suggestions deterministically based on title
  const titleHash = entry.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffledCategorySuggestions = [...categorySuggestions].sort(
    (a, b) => ((a.charCodeAt(0) + titleHash) % 100) - ((b.charCodeAt(0) + titleHash) % 100)
  );

  // Add category suggestions until we have at least 3
  for (const suggestion of shuffledCategorySuggestions) {
    if (suggestions.length >= 5) break;
    addSuggestion(suggestion);
  }

  // 3. Ensure we have at least 3 suggestions
  if (suggestions.length < 3) {
    const fallbackSuggestions = CATEGORY_SUGGESTIONS.general;
    for (const suggestion of fallbackSuggestions) {
      if (suggestions.length >= 3) break;
      addSuggestion(suggestion);
    }
  }

  return suggestions;
}

/**
 * Available categories for the form
 */
export const CATEGORIES = [
  "Productivity",
  "Health",
  "Admin",
  "Customer Support",
  "Engineering",
  "General",
] as const;

export type Category = (typeof CATEGORIES)[number];


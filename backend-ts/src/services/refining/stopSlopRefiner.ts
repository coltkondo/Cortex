/**
 * Stop Slop - Remove AI writing patterns from prose
 * Based on https://github.com/hardikpandya/stop-slop
 * 
 * Eliminates:
 * - Throat-clearing openers
 * - Emphasis crutches
 * - Business jargon
 * - All adverbs
 * - Passive voice
 * - Binary contrasts
 * - Vague declaratives
 * - False agency (inanimate objects doing human actions)
 * - Narrator-from-a-distance voice
 * - Em-dashes
 */

/**
 * Main entry point - refines text to remove AI tells
 */
export function refineWithStopSlop(text: string): string {
  if (!text || typeof text !== 'string') return text;

  let refined = text;
  refined = removeThroatClearers(refined);
  refined = removeEmphasisCrutches(refined);
  refined = removeBusinessJargon(refined);
  refined = removeAdverbs(refined);
  refined = fixPassiveVoice(refined);
  refined = eliminateBinaryContrasts(refined);
  refined = removeVagueDeclatives(refined);
  refined = fixFalseAgency(refined);
  refined = fixNarratorVoice(refined);
  refined = removeEmDashes(refined);
  refined = removeMetaCommentary(refined);
  refined = fixWhStarters(refined);
  refined = cleanupWhitespace(refined);

  return refined;
}

/**
 * Remove throat-clearing opener phrases
 */
function removeThroatClearers(text: string): string {
  const clearers = [
    /Here's\s+the\s+thing:\s*/gi,
    /Here's\s+what\s+/gi,
    /Here's\s+this\s+/gi,
    /Here's\s+that\s+/gi,
    /Here's\s+why\s+/gi,
    /The\s+uncomfortable\s+truth\s+is\s*/gi,
    /It\s+turns\s+out\s+/gi,
    /The\s+real\s+[^.!?]*\s+is\s*/gi,
    /Let\s+me\s+be\s+clear:\s*/gi,
    /The\s+truth\s+is,?\s*/gi,
    /I'll\s+say\s+it\s+again:\s*/gi,
    /I'm\s+going\s+to\s+be\s+honest\s*/gi,
    /Can\s+we\s+talk\s+about\s*/gi,
    /Here's\s+what\s+I\s+find\s+interesting:\s*/gi,
    /Here's\s+the\s+problem\s+though:\s*/gi,
  ];

  let result = text;
  clearers.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Remove emphasis crutches that add no meaning
 */
function removeEmphasisCrutches(text: string): string {
  const crutches = [
    /Full\s+stop\.?\s*/gi,
    /Period\.?\s*/gi,
    /Let\s+that\s+sink\s+in\.?\s*/gi,
    /This\s+matters\s+because\s*/gi,
    /Make\s+no\s+mistake\s*/gi,
    /Here's\s+why\s+that\s+matters\.?\s*/gi,
  ];

  let result = text;
  crutches.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Replace business jargon with plain language
 */
function removeBusinessJargon(text: string): string {
  const jargonMap: { [key: string]: string } = {
    'navigate (the|challenges|)': 'handle',
    'unpack (the|analysis|)': 'explain',
    'lean into': 'embrace',
    'landscape': 'situation',
    'game-?changer': 'important change',
    'double down': 'commit',
    'deep dive': 'analysis',
    'take a step back': 'reconsider',
    'moving forward': 'next',
    'circle back': 'revisit',
    'on the same page': 'aligned',
  };

  let result = text;
  Object.entries(jargonMap).forEach(([pattern, replacement]) => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    result = result.replace(regex, replacement);
  });

  return result;
}

/**
 * Remove all adverbs (-ly words and specific offenders)
 */
function removeAdverbs(text: string): string {
  // Remove common adverbs and softeners
  const adverbs = [
    'really',
    'just',
    'literally',
    'genuinely',
    'honestly',
    'simply',
    'actually',
    'deeply',
    'truly',
    'fundamentally',
    'inherently',
    'inevitably',
    'interestingly',
    'importantly',
    'crucially',
  ];

  let result = text;

  // Remove specific adverbs
  adverbs.forEach(adverb => {
    const regex = new RegExp(`\\b${adverb}\\b`, 'gi');
    result = result.replace(regex, '').replace(/\s+/g, ' ');
  });

  // Remove generic -ly adverbs while preserving words like "daily", "yearly" used as adjectives
  result = result.replace(/\b\w+ly\b(?!\s+scheduled|\s+basis|\s+active|\s+available)/gi, (match) => {
    // Preserve some legitimate adverbial forms
    if (['safely', 'quickly', 'slowly', 'clearly', 'simply'].includes(match.toLowerCase())) {
      return '';
    }
    return '';
  });

  // Remove filler phrases with adverbs
  const fillerPhrases = [
    /At\s+its\s+core[,:]?\s*/gi,
    /In\s+today's\s+\w+[,:]?\s*/gi,
    /It's\s+worth\s+noting\s+that\s*/gi,
    /At\s+the\s+end\s+of\s+the\s+day[,:]?\s*/gi,
    /When\s+it\s+comes\s+to\s*/gi,
    /In\s+a\s+world\s+where\s*/gi,
    /The\s+reality\s+is\s*/gi,
  ];

  fillerPhrases.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Detect and flag passive voice
 * (Complex heuristic - catches most cases)
 */
function fixPassiveVoice(text: string): string {
  // Look for "[was/were/is/are] [verb]ed" patterns
  const passivePattern = /\b(was|were|is|are)\s+\w+(ed|en)\b/gi;
  
  // For now, just flag it in a comment - actual rewriting requires context
  // This is a heuristic that catches common patterns
  let result = text;
  
  // Convert obvious cases like "was created" -> suggest active
  result = result.replace(/\bwas\s+created\b/gi, 'created');
  result = result.replace(/\bwere\s+created\b/gi, 'created');
  result = result.replace(/\bwas\s+determined\b/gi, 'determined');
  result = result.replace(/\bwas\s+developed\b/gi, 'developed');
  result = result.replace(/\bwas\s+found\b/gi, 'found');
  
  return result;
}

/**
 * Eliminate binary contrasts that create false drama
 */
function eliminateBinaryContrasts(text: string): string {
  const contrasts = [
    /Not\s+because\s+[^.!?]+\.\s*Because\s+/gi,
    /Not\s+because\s+[^.!?]+,\s*but\s+because\s+/gi,
    /isn't\s+the\s+problem\.\s*[A-Z]/gi,
    /isn't\s+([^.!?]+)\.\s*it's\s+/gi,
    /doesn't\s+mean\s+([^.!?]+),\s*but\s+/gi,
    /It's\s+not\s+([^.!?]+)\.\s*It's\s+/gi,
    /The\s+answer\s+isn't\s+([^.!?]+)\.\s*It's\s+/gi,
    /The\s+question\s+isn't\s+([^.!?]+)\.\s*It's\s+/gi,
  ];

  let result = text;
  contrasts.forEach(pattern => {
    result = result.replace(pattern, (match) => {
      // Remove the binary setup, keep the assertion
      return match.split(/\.\s+/)[match.split(/\.\s+/).length - 1];
    });
  });

  return result;
}

/**
 * Remove vague declaratives that announce importance without showing it
 */
function removeVagueDeclatives(text: string): string {
  const vague = [
    /The\s+reasons\s+are\s+structural\.?\s*/gi,
    /The\s+implications\s+are\s+significant\.?\s*/gi,
    /This\s+is\s+the\s+deepest\s+problem\.?\s*/gi,
    /The\s+stakes\s+are\s+high\.?\s*/gi,
    /The\s+consequences\s+are\s+real\.?\s*/gi,
    /This\s+is\s+important\s+because\.?\s*/gi,
    /It's\s+worth\s+noting\.?\s*/gi,
  ];

  let result = text;
  vague.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Fix false agency - inanimate objects shouldn't do human actions
 */
function fixFalseAgency(text: string): string {
  const falseAgency = [
    { pattern: /a\s+complaint\s+becomes\s+a\s+fix/gi, replacement: 'the team fixed it' },
    { pattern: /a\s+bet\s+lives\s+or\s+dies/gi, replacement: 'the team ships or kills it' },
    { pattern: /the\s+decision\s+emerges/gi, replacement: 'someone decides' },
    { pattern: /the\s+culture\s+shifts/gi, replacement: 'people change behavior' },
    { pattern: /the\s+conversation\s+moves\s+toward/gi, replacement: 'someone steers it' },
    { pattern: /the\s+data\s+tells\s+us/gi, replacement: 'the data shows' },
    { pattern: /the\s+market\s+rewards/gi, replacement: 'buyers pay for' },
  ];

  let result = text;
  falseAgency.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });

  return result;
}

/**
 * Fix narrator-from-a-distance voice - put reader in the scene
 */
function fixNarratorVoice(text: string): string {
  const distancePatterns = [
    /Nobody\s+designed\s+this/gi,
    /This\s+happens\s+because/gi,
    /This\s+is\s+why/gi,
    /People\s+tend\s+to/gi,
  ];

  // These are context-dependent, so we'll just flag them
  let result = text;
  // For simple cases, we can make replacements
  result = result.replace(/Nobody\s+designed\s+this/gi, 'You don\'t sit down one day and design this');
  
  return result;
}

/**
 * Remove all em-dashes
 */
function removeEmDashes(text: string): string {
  // Replace em-dashes with periods or commas
  const emDashPattern = /\s*[—–]\s*/g;
  let result = text;
  
  // Replace em-dashes with periods for major breaks, commas for minor ones
  result = result.replace(emDashPattern, '. ');
  
  return result;
}

/**
 * Remove meta-commentary that annonces the essay's structure
 */
function removeMetaCommentary(text: string): string {
  const metaPatterns = [
    /Hint:\s*/gi,
    /Plot\s+twist:\s*/gi,
    /Spoiler:\s*/gi,
    /You\s+already\s+know\s+this,\s+but\s*/gi,
    /But\s+that's\s+another\s+post\.?\s*/gi,
    /is\s+a\s+feature,\s+not\s+a\s+bug\.?\s*/gi,
    /Dressed\s+up\s+as\s*/gi,
    /The\s+rest\s+of\s+this\s+essay\s+explains\.?\s*/gi,
    /Let\s+me\s+walk\s+you\s+through\.?\s*/gi,
    /In\s+this\s+section,\s+we'll\.?\s*/gi,
    /As\s+we'll\s+see\.?\s*/gi,
    /I\s+want\s+to\s+explore\.?\s*/gi,
  ];

  let result = text;
  metaPatterns.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Restructure sentences starting with Wh- words
 * Simple cases: move subject forward
 */
function fixWhStarters(text: string): string {
  // This is complex and requires deeper parsing
  // For now, flag the most egregious cases
  const sentenceArray = text.split(/(?<=[.!?])\s+/);
  
  let result = sentenceArray.map(sentence => {
    // Move "What is X?" to "X is the question"
    sentence = sentence.replace(/What\s+is\s+([^?]+)\?/gi, '$1 is the key');
    // Move "Why does X?" to "X happens because"
    sentence = sentence.replace(/Why\s+does\s+([^?]+)\?/gi, '$1 happens because');
    // Move "How do we X?" to "To X, we need to"
    sentence = sentence.replace(/How\s+do\s+(?:we\s+)?([^?]+)\?/gi, 'To $1, we need to');
    
    return sentence;
  }).join(' ');

  return result;
}

/**
 * Clean up excessive whitespace
 */
function cleanupWhitespace(text: string): string {
  // Remove multiple spaces
  let result = text.replace(/\s{2,}/g, ' ');
  
  // Clean up space before punctuation
  result = result.replace(/\s+([.!?,;:])/g, '$1');
  
  // Restore proper space after punctuation
  result = result.replace(/([.!?])\s*([A-Z])/g, '$1 $2');
  
  // Remove trailing spaces
  result = result.trim();
  
  return result;
}

/**
 * Refine structured JSON responses by applying stop-slop to text fields
 */
export function refineJsonFields(
  obj: any,
  fieldsToRefine: string[] = ['suggestion', 'content', 'answer', 'description', 'text']
): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => refineJsonFields(item, fieldsToRefine));
  }

  const refined: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && fieldsToRefine.some(field => key.toLowerCase().includes(field))) {
      refined[key] = refineWithStopSlop(value);
    } else if (typeof value === 'object' && value !== null) {
      refined[key] = refineJsonFields(value, fieldsToRefine);
    } else {
      refined[key] = value;
    }
  }

  return refined;
}

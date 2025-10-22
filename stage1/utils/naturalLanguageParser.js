export function parseNaturalLanguage(query) {

  const filters = {};
  const lower = query.toLowerCase();

  if (lower.includes('single word')) {
    filters.word_count = 1;
  }

  if (lower.includes('palindromic')) {
    filters.is_palindrome = true;
  }

  const longerMatch = lower.match(/longer than (\d+) characters?/);
  if (longerMatch) {
    filters.min_length = parseInt(longerMatch[1]) + 1; // strictly longer than
  }

  const shorterMatch = lower.match(/shorter than (\d+) characters?/);
  if (shorterMatch) {
    filters.max_length = parseInt(shorterMatch[1]) - 1; // strictly shorter than
  }

  const containsMatch = lower.match(/containing the letter (\w)/);
  if (containsMatch) {
    filters.contains_character = containsMatch[1];
  }

  if (lower.includes('contain the first vowel')) {
    filters.contains_character = 'a';
  }


  if (Object.keys(filters).length === 0) {
    throw new Error('Unable to parse natural language query');
  }

  return {
    filters,
    interpreted_query: {
      original: query,
      parsed_filters: filters,
    },
  };
}

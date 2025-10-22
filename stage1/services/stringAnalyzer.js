import crypto from 'crypto';

export function analyzeString(value) {
    const cleaned = value.trim();
    const lower = cleaned.toLowerCase();

    return {
        length: cleaned.length,
        is_palindrome: lower === lower.split('').reverse().join(''),
        unique_characters:[...new Set(cleaned)].length,
        word_count: cleaned.split(/\s+/).length,
        sha256_hash: crypto.createHash('sha256').update(cleaned).digest('hex'),
        character_frequency_map: getCharFrequency(cleaned),
    };
}
function getCharFrequency(str) {
    const freq = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}
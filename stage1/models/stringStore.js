export const stringStore = new Map();

export function saveString(value, fullObject) {
    stringStore.set(value, fullObject);
}

export function getString(value) {
    return stringStore.get(value);
}
export function deleteString(value) {
    return stringStore.delete(value);
}
export function getAllStrings() {
    return Array.from(stringStore.entries()).map(([value, analysis]) => ({
        value,
        ...analysis,
    }));
}


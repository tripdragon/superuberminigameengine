// only checks for "s" right now, so "walrus" would be false
// "i" or "es" fishes wont work, wellll fishes would....
window.isKindaPural = (word) => {
    let bb = word.toLowerCase().substr(-1);
    if (bb === "s") return true;
    return false;
}

// NOTE must be the string version of the word
window.isNumber = (strWord) => {
    if(isNaN(strWord)) return false;
    return true;
}

// NOTE should be the dictionary version of the word
window.hasTag = (item, tag) => item?.tags.includes(tag);

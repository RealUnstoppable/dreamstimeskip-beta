export const localFacts = [
    "A group of flamingos is called a 'flamboyance'.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "The national animal of Scotland is the unicorn.",
    "A day on Venus is longer than a year on Venus.",
    "Octopuses have three hearts.",
    "There are more trees on Earth than stars in the Milky Way galaxy.",
    "Bananas are berries, but strawberries aren't.",
    "The Eiffel Tower can be 15 cm taller during the summer due to the expansion of the iron on hot days.",
    "A crocodile cannot stick its tongue out.",
    "Wombat poop is cube-shaped.",
    "The heart of a blue whale is so big, a human could swim through its arteries.",
    "It's impossible for most people to lick their own elbow.",
    "A bolt of lightning is six times hotter than the sun.",
    "Sloths can take up to a month to digest a single leaf.",
    "The first oranges weren't orange.",
    "There’s an island in Japan populated only by friendly rabbits.",
    "A shrimp's heart is in its head.",
    "Sea otters hold hands when they sleep so they don't float away from each other.",
    "The blob of toothpaste on a toothbrush has a name: a 'nurdle'.",
    "There is a town in Norway called 'Hell'.",
    "Goats have rectangular pupils.",
    "An ostrich's eye is bigger than its brain.",
    "The unicorn is the national animal of Scotland.",
    "Some cats are allergic to humans.",
    "Humans share 50% of their DNA with bananas.",
    "The inventor of the Pringles can is now buried in one.",
    "In Switzerland, it is illegal to own just one guinea pig.",
    "The longest English word is 189,819 letters long.",
    "A single cloud can weigh more than 1 million pounds.",
    "A 'jiffy' is an actual unit of time: 1/100th of a second.",
    "The Hawaiian alphabet has only 13 letters.",
    "Banging your head against a wall for one hour burns 150 calories.",
    "In the 16th Century, Turkish women could legally divorce their husbands if they didn’t pour coffee for them.",
    "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
    "Chewing gum boosts concentration.",
    "Hot water will turn into ice faster than cold water.",
    "A small child could swim through the veins of a blue whale.",
    "Ketchup was sold in the 1830s as medicine.",
    "There are more fake flamingos in the world than real ones.",
    "A duel between three people is called a truel.",
    "Dragonflies have six legs but cannot walk.",
    "The moon has moonquakes.",
    "The King of Hearts is the only king without a mustache.",
    "The ampersand symbol (&) is formed from the letters in 'et,' the Latin word for 'and'.",
    "It rains diamonds on Saturn and Jupiter.",
    "You are more likely to be killed by a vending machine than a shark.",
    "Nintendo was founded in 1889 as a playing card company.",
    "A sneeze travels at about 100 miles per hour.",
    "Cap'n Crunch's full name is Horatio Magellan Crunch.",
    "A group of pandas is called an 'embarrassment'.",
    "A day on Mercury lasts 176 Earth days.",
    "A single strand of spider silk is stronger than a steel wire of the same thickness.",
    "Cows have best friends and get stressed when separated.",
    "A blue whale's tongue can weigh as much as an elephant."
];

export const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getFactForDate = (dateString) => {
    let factCache = JSON.parse(localStorage.getItem('factCache')) || {};
    
    // If a fact for this date is already cached, return it.
    if (factCache[dateString]) {
        return factCache[dateString];
    }
    
    // Get all facts that have already been used.
    const usedFacts = new Set(Object.values(factCache));
    
    // Find all facts from our local list that haven't been used yet.
    const availableFacts = localFacts.filter(fact => !usedFacts.has(fact));
    
    let newFact;
    if (availableFacts.length > 0) {
        // Pick a random fact from the available ones.
        // We use a simple hash of the date string to make it deterministic across multiple calls
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            hash = (Math.imul(31, hash) + dateString.charCodeAt(i)) | 0;
        }
        const index = Math.abs(hash) % availableFacts.length;
        newFact = availableFacts[index];
    } else {
        // If we've run out of unique facts, provide a fallback.
        newFact = "You've seen all the available facts! Check back later for more.";
    }

    // Cache the new fact for the given date and save to local storage.
    factCache[dateString] = newFact;
    localStorage.setItem('factCache', JSON.stringify(factCache));
    
    return newFact;
};

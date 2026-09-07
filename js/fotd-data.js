export const fotdDatabase = [
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
    "A jiffy is an actual unit of time for 1/100th of a second.",
    "Peanuts aren't technically nuts; they are legumes.",
    "An ant can lift 50 times its own body weight.",
    "Water makes up about 71% of the Earth's surface.",
    "The human nose can detect over 1 trillion different scents."
];

export function getFactForDate(dateString) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0; 
    }
    const index = Math.abs(hash) % fotdDatabase.length;
    return fotdDatabase[index];
}

export function getFactForToday() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return getFactForDate(dateString);
}

async function search(query) {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`);
    const data = await (res).json();
    if (data.results && data.results.length > 0) {
        const track = data.results[0];
        console.log(`Query: "${query}"`);
        console.log(`Title: ${track.trackName}`);
        console.log(`Artist: ${track.artistName}`);
        console.log(`Cover Art: ${track.artworkUrl100.replace('100x100bb', '600x600bb')}`);
    } else {
        console.log(`No results for "${query}"`);
    }
}
search("What You Know Bout Love Pop Smoke");
search("Passo Bem Solto Atlxs");
search("Where Have You Been Rihanna");

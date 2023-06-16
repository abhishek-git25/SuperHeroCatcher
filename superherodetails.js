const timestamp = Math.floor(Date.now() / 1000).toString();
const publicKey = 'aa0e67498daa0b164c2943a5b105730f';
const privateKey = 'c5d8bfd6708381fed794ff6dbd374495ecefaed3';
const url = window.location.href;
var superHeroImage = document.getElementById('superhero-img');
const imageTitle = document.getElementById('image-title');
const imageDesc = document.getElementById('image-description');
const comics = document.getElementById('comics-name');
const series = document.getElementById('series-name');
const stories = document.getElementById('story-name');

// Use a regular expression to extract the ID from the URL
const regex = /[\?&]id=([^&#]*)/.exec(url);
const id = regex ? regex[1] : null;
let simplifiedData = [];
let obj = {
    name: "",
    image: "",
    description: ""
};

// function to generate hash key
function generateHash(timestamp, publicKey, privateKey) {
    const inputString = timestamp + privateKey + publicKey;
    const hash = CryptoJS.MD5(inputString).toString();
    return hash;
}


const hash = generateHash(timestamp, publicKey, privateKey);

async function fetchSuperHeroDetails() {
    try {
        const res = await fetch(`https://gateway.marvel.com/v1/public/characters/${id}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`)
        const data = await res.json()
        getData(data)
    } catch (error) {
        console.log(error);
    }

}

function getData(data) {
    console.log(data, "41");
    let results = data.data.results[0];
    let image = results.thumbnail.path + "." + results.thumbnail.extension;
    superHeroImage.src = image;
    imageTitle.innerText = results.name;
    imageDesc.innerText = results.description ? results.description : "No Description";

    comics.textContent = results.comics.items.map((item) => {
        return item.name;
    }).join('  ||  ')

    series.textContent = results.series.items.map((item) => {
        return item.name
    }).join('  ||  ')

    stories.innerText = results.stories.items.map((item) => {
        return item.name.slice(0 ,32)
    }).join('  ||  ')
}





fetchSuperHeroDetails()

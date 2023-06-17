var searchIconId = document.getElementById("searh_icon");
var searchContainer = document.getElementById("search_container");
var favouriteListContainer = document.getElementById('favourites-container')
var cardMain = document.getElementById('card-main-container');
const timestamp = Math.floor(Date.now() / 1000).toString();
const publicKey = 'aa0e67498daa0b164c2943a5b105730f';
const privateKey = 'c5d8bfd6708381fed794ff6dbd374495ecefaed3';
const searchInput = document.getElementById('search_superhero');
const searchListWeb = document.getElementById('search_list_web');
const searchListMobile = document.getElementById('search_list_mobile');
const loader = document.getElementById('loading');
var dynamicData = [];
var favourites = JSON.parse(localStorage.getItem('favourite_superhero')) || [];


// function to generate hash key
function generateHash(timestamp, publicKey, privateKey) {
  const inputString = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(inputString).toString();
  return hash;
}

const hash = generateHash(timestamp, publicKey, privateKey);

const superHeroList = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
const ts = Date.now().toString();   // genrating time stamp 


// function to toggle search container on mobile view

function toggleSeachContainer(e) {
  if (searchContainer.style.display === '' || searchContainer.style.display === 'none') {
    searchContainer.style.display = 'block'
  } else {
    searchContainer.style.display = 'none'
  }

}


// superherolist api call
async function fetchSuperHeros() {
  loader.style.display = "block";
  try {
    const res = await fetch(superHeroList)
    const data = await res.json()
    if (data.code === 200 && data.status ===  'Ok') {
      loader.style.display = "none";
      getDataList(data)
    }

  } catch (error) {
    console.log(error);
  }
}

// gets the list of the superheros
function getDataList(data) {
  let finalData = data.data.results
  for (let i = 0; i < finalData.length; i++) {
    dynamicData.push(finalData[i]);
    addSuperHerosToDom(finalData[i]);
  }
}

// redirects to details page
function redirectToDetails(id) {
  const url = new URL(`superherodetails.html?id=${id}`, window.location.href);
  window.location.href = url;
}

// Renders each superhero to dom
function addSuperHerosToDom(data) {
  let html = `<div class="card home-list me-3 mt-3" data-id = "${data.id}" >
<img src=${data.thumbnail.path + "." + data.thumbnail.extension} alt="superhero1" width="100" height="100" class="mx-auto">
<div class="text-white text-center mt-3">Name : ${data.name}</div>
<a href="superherodetails.html?id=${data.id}"  onclick="redirectToDetails(${data.id})"  class="text-white text-center mt-1">Go to Details</a><button class="btn btn-dark mt-2">Add to Favourite</button></div>`
  cardMain.innerHTML += html;
}



// extracts the favourite superhero according to the id
function getDataById(uniqueId) {
  const favouriteSuperHero = dynamicData.find((hero) => hero.id == uniqueId);
  return favouriteSuperHero;
}

// adds the superhero to the new Array
function addToFavourites(data) {
  const isAlreadyFavourite = favourites.some((hero) => hero.id === data.id);
  if (isAlreadyFavourite) {
    alert("Superhero is already in favorites.");
    return;
  }
  favourites.push(data)
  localStorage.setItem('favourite_superhero', JSON.stringify(favourites))
  getFavourites();

}

// function to render favourites in dom

function renderFavouriteSuperHero(favourite) {
  let favouriteHtml = `<div class="card me-3 mt-2" >
  <img src= ${favourite.thumbnail.path + "." + favourite.thumbnail.extension}  alt="superhero1" width="100" height="100" class="mx-auto">
  <div class="text-white text-center mt-3">Name : ${favourite.name}</div>
  <a href="superherodetails.html?id=${favourite.id}" onclick="redirectToDetails(${favourite.id})" class="text-white text-center mt-1">
      Go to Details</a>
  <button class="btn btn-dark mt-2" onclick = "removeFavourite(${favourite.id})">Remove Favourite</button>
</div>`
  favouriteListContainer.innerHTML += favouriteHtml;

}

// function to remove favourites
function removeFavourite(id) {
  favourites = favourites.filter((item) => item.id !== id)
  localStorage.setItem('favourite_superhero', JSON.stringify(favourites))
  getFavourites()
}

// function to get favourites an iterate them over function which renders to DOM
function getFavourites() {
  const getFavs = JSON.parse(localStorage.getItem('favourite_superhero'));
  favouriteListContainer.innerHTML = '';
  if (getFavs && getFavs.length > 0) {
    for (let i = 0; i < getFavs.length; i++) {
      renderFavouriteSuperHero(getFavs[i])
    }
  }
}


// function to render search list  for web

function renderSearchList(value) {
  const li = document.createElement('li')
  li.innerHTML += `<span onclick="redirectToDetails(${value.id})">${value.name}</span>`
  searchListWeb.append(li);
}

// function to render search list  for mobile

function renderSearchListMobile(value) {
  const li = document.createElement('li');
  li.innerHTML += `<span onclick="redirectToDetails(${value.id})">${value.name}</span>`
  searchListMobile.append(li);
}


// function to handle search box value

function handleSearch(event, type) {
  let searchInput = type === 'web' ? document.getElementById('search_superhero_web') : document.getElementById('search_superhero_mobile')
  let searchTerm = searchInput.value;
  searchTerm = searchTerm.toLowerCase()
  if (type === 'mobile') {
    searchListMobile.innerHTML = '';
  } else {
    searchListWeb.innerHTML = ''
  }
  const fitlerSearch = dynamicData.filter((item) => {
    const searchedData = item.name.toLowerCase();
    let filteredSuperHero = searchTerm ? searchedData.startsWith(searchTerm) : ""
    return filteredSuperHero
  })
  fitlerSearch.map((item) => {
    if (type === 'mobile') {
      renderSearchListMobile(item)
    } else if (type === 'web') {
      renderSearchList(item)
    }
  })
}


//  gets the end pathname
let pathname = window.location.href.split('/')
pathname = pathname[pathname.length - 1]



// only renders when a certain pathname matches
if (pathname === 'index.html') {
  cardMain.addEventListener('click', function (event) {
    const addButton = event.target.closest(".card .btn-dark")
    if (addButton) {
      const card = addButton.closest('.card')
      const uniqueId = card.dataset.id;
      const selectedSuperHero = getDataById(uniqueId);
      addToFavourites(selectedSuperHero)
    }
  })
}



getFavourites()
fetchSuperHeros()
searchIconId.addEventListener('click', toggleSeachContainer)
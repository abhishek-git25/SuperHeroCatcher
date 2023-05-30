var searchIconId = document.getElementById("searh_icon");
var searchContainer = document.getElementById("search_container");



// function to toggle search container on mobile view

function toggleSeachContainer (e){
    if(searchContainer.style.display === '' || searchContainer.style.display === 'none'){
        searchContainer.style.display = 'block'
    }else{
        searchContainer.style.display = 'none'
    }

}

searchIconId.addEventListener('click' , toggleSeachContainer)
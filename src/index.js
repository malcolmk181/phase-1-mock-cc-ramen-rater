// write your code here

const SERVER = 'http://localhost:3000/ramens'

// I know there's a defer, but I want to use DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    /*
        CONSTANTS
    */
    const ramenMenu = document.querySelector('#ramen-menu');
    const ramenDetail = document.querySelector('#ramen-detail');
    const ratingDisplay = document.querySelector('#rating-display');
    const commentDisplay = document.querySelector('#comment-display');
    const newRamenForm = document.querySelector('#new-ramen');

    // given a ramen object, add it to the ramen menu
    const addRamenToMenu = ramen => {
        const ramenImage = document.createElement('img');
        ramenImage.src = ramen.image;
        ramenImage.alt = ramen.name;
        ramenImage.dataset.id = ramen.id;
        ramenMenu.appendChild(ramenImage);
    };

    // given a ramen object, load it into the ramen-details div
    const loadRamenDetails = ramen => {
        const image = ramenDetail.querySelector('img');
        image.src = ramen.image;
        image.alt = ramen.name;

        const name = ramenDetail.querySelector('h2');
        name.textContent = ramen.name;

        const restaurant = ramenDetail.querySelector('h3');
        restaurant.textContent = ramen.restaurant;

        ratingDisplay.textContent = ramen.rating;

        commentDisplay.textContent = ramen.comment;
    };

    /*
        CODE
    */

    // populate the ramen-menu with ramen images
    fetch(SERVER)
    .then(resp => resp.json())
    .then(ramens => ramens.forEach(addRamenToMenu));

    // listen for clicks on the images, and populate the ramen-detail section
    ramenMenu.addEventListener('click', event => {
        // confirm our target is the image (that has the id data-attribute)
        if (event.target.nodeName === "IMG") {
            // load the ramen referenced by the clicked image
            fetch(`${SERVER}/${event.target.dataset.id}`)
            .then(resp => resp.json())
            .then(loadRamenDetails);
        }
    });

    // listen for submissions of the new ramen form
    newRamenForm.addEventListener('submit', event => {
        // prevent reloading of the page
        event.preventDefault();

        // submit post request
        fetch(SERVER, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: event.target.name.value,
                restaurant: event.target.restaurant.value,
                image: event.target.image.value,
                rating: event.target.rating.value,
                comment: event.target.querySelector('#new-comment').value
            })
        })
        .then(resp => resp.json())
        .then(ramen => {
            // add ramen to menu
            addRamenToMenu(ramen);

            // clear the form
            event.target.reset();
        })
    });
});
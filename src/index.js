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
    const editRamenForm = document.querySelector('#edit-ramen');
    const deleteRamenForm = document.querySelector('#delete-ramen');

    // given a ramen object, add it to the ramen menu
    const addRamenToMenu = ramen => {
        const ramenImage = document.createElement('img');
        ramenImage.src = ramen.image;
        ramenImage.alt = ramen.name;
        ramenImage.dataset.id = ramen.id;
        ramenMenu.appendChild(ramenImage);
    };

    // given a ramen object, load it into the ramen-details div & edit-ramen form
    const loadRamenDetails = ramen => {
        ramenDetail.dataset.id = ramen.id;
        
        // ramen-details

        const image = ramenDetail.querySelector('img');
        image.src = ramen.image;
        image.alt = ramen.name;

        const name = ramenDetail.querySelector('h2');
        name.textContent = ramen.name;

        const restaurant = ramenDetail.querySelector('h3');
        restaurant.textContent = ramen.restaurant;

        ratingDisplay.textContent = ramen.rating;

        commentDisplay.textContent = ramen.comment;

        // edit-ramen form

        editRamenForm.querySelector('#new-rating').value = ramen.rating;
        editRamenForm.querySelector('#new-comment').value = ramen.comment;
    };

    /*
        CODE
    */

    // populate the ramen-menu with ramen images, and load the first one into ramen-detail
    fetch(SERVER)
    .then(resp => resp.json())
    .then(ramens => ramens.forEach((ramen, index) => {
        addRamenToMenu(ramen);

        if (index == 0) { loadRamenDetails(ramen); }
    }));

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
                comment: event.target.comment.value
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

    // listen for submissions of the edit ramen form
    editRamenForm.addEventListener('submit', event => {
        // prevent default reloading of page
        event.preventDefault();

        // grab the ramen id
        const id = ramenDetail.dataset.id;

        // submit patch request
        fetch(`${SERVER}/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rating: event.target.querySelector('#new-rating').value,
                comment: event.target.querySelector('#new-comment').value
            })
        })
        .then(resp => resp.json())
        .then(ramen => {{
            // update the rating & comment on the page
            // I could use loadRamenDetails - but why modify & reload more than necessary?
            ratingDisplay.textContent = ramen.rating;
            commentDisplay.textContent = ramen.comment;  
        }});
    });

    // listen for submissions of the delete ramen form
    deleteRamenForm.addEventListener('submit', event => {
        // prevent default reloading of page
        event.preventDefault();

        // grab the ramen id
        const id = ramenDetail.dataset.id;

        // submit delete request
        fetch(`${SERVER}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            // grab the ramen id
            const id = ramenDetail.dataset.id;

            // remove the deleted ramen from the menu
            Array.from(ramenMenu.children).forEach(child => {
                if (child.dataset.id === id) { child.remove(); }
            });

            // load first ramen from the menu
            const newRamenToLoad = ramenMenu.children[0];

            fetch(`${SERVER}/${newRamenToLoad.dataset.id}`)
            .then(resp => resp.json())
            .then(loadRamenDetails);
        });
    });
});
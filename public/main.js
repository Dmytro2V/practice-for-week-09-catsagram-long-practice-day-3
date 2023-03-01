import { resetScore, updateScore} from './score.js';
import { resetComments, restoreComments } from './comments.js';

export const createMainContent = () => {
    // Create h1
    const h1 = document.createElement("h1");
    h1.innerText = "Catstagram";

    // Create img
    const img = document.createElement("img");
    img.style.margin = "20px";
    img.style.maxWidth = "750px";

    const newKittenBtn = createNewKittenBtn();

    const container = document.querySelector(".container");
    container.appendChild(h1);
    container.append(newKittenBtn);
    container.appendChild(img);

    // check local image saved:
    let localImageLink = localStorage.getItem("catstagramImageLink")
    if (localImageLink) fetchImage(localImageLink);
    else fetchImage();
};

const fetchImage = async (link) => {
    // Fetch image from API and set img url    
    try {
        let kittenImgUrl;
        if (typeof link === 'string') { // string url
            kittenImgUrl = link;
        } else { // event from button

            const kittenResponse = await fetch("https://api.thecatapi.com/v1/images/search?size=small");
            // Converts to JSON
            const kittenData = await kittenResponse.json();
            // console.log(kittenData);
            kittenImgUrl = kittenData[0].url;
            // on receiving new url save it to localStorage
          //  localStorage.setItem("catstagramImageLink", kittenImgUrl);
        }
        const kittenImg = document.querySelector("img");
        kittenImg.src = kittenImgUrl;

        // After the image is finished loading, reset or restore the score and comments
        kittenImg.addEventListener('load', () => {
            if (typeof link === 'string') { // string url
                let score = localStorage.getItem("catstagramScore");
                updateScore(score);
                let commentsJSON = localStorage.getItem("catstagramComments");
                restoreComments(commentsJSON)
            } else {// event from button
            resetScore();
            resetComments();
            // on loading  new picture  save url to localStorage
            console.log('saving url', kittenImgUrl);
            localStorage.setItem("catstagramImageLink", kittenImgUrl);

            }
        });
    } catch (e) {
        console.log("Failed to fetch image", e);
    }
};

const createNewKittenBtn = () => {
    // Create "New Kitten" button
    const newKittenBtn = document.createElement("button");
    newKittenBtn.id = "new-kitten";
    newKittenBtn.innerText = "New Kitten";
    newKittenBtn.addEventListener('click', fetchImage);
    return newKittenBtn;
};

const generateForm = document.querySelector(".generate-form");

const imgGallery = document.querySelector(".img-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imgGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

    const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;
        //when image is loaded remove loading class and download
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}
      

//generate AI images

const generateAiImages = async (UserPrompt, userImgQuantity) => {
    try {
        //send request to open AI to find image
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: UserPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to find images!")

        const { data } = await response.json(); //get data from user response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

//preventing empty form from submissioin

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    
//user input and quantity of images

const UserPrompt = e.srcElement[0].value;
const userImgQuantity = e.srcElement[1].value;

const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
    `<div class="img-card loading">
    <img src="img/loader.svg" alt="img">
    <a href="#" class="download-btn">
        <img src="img/download12.svg" alt="download icon">
    </a>
    </div>`
).join("");


imgGallery.innerHTML = imgCardMarkup;

//generate images using AI

generateAiImages(UserPrompt, userImgQuantity);

}

generateForm.addEventListener("submit", handleFormSubmission);
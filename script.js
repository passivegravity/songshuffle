const generateButton = document.getElementById("generate-button");
const genreSelect = document.getElementById("genre-select");
const outputField = document.getElementById("output-field");
outputField.classList.add("generated-link");
const playButton = document.getElementById("play-button");
outputField.classList.add("play-button");
const audio = new Audio();
const songProgressBar = document.getElementById("song-progress-bar");
const previewErrorText = document.getElementById("preview-error-text");


// Function to play audio from Spotify track URL
function playAudio(trackUrl) {
  audio.volume = 0.2;
  const trackId = trackUrl.split('/').pop();
  fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    const previewUrl = data.preview_url;
    if (!previewUrl) {
      console.error(`Preview not available for ${data.name} by ${data.artists[0].name}`);
      previewErrorText.textContent = "Preview is not available for this song";
      return;
    }
    audio.src = previewUrl;
    audio.play();
  })
  .catch((error) => {
    console.error(error);
  });
}
let accessToken = null;
const clientId = '2908a1e2d9a7493db80ff866388c4a28';
const clientSecret = 'f6c8c829d50442a9928b69bedbcb310e';

// Function to update the access token when it expires
function updateAccessToken() {
  fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  })
    .then(response => response.json())
    .then(data => {
      accessToken = data.access_token;
      console.log(`Access token updated: ${accessToken}`);
      setTimeout(updateAccessToken, data.expires_in * 1000);
    })
    .catch(error => {
      console.error(`Error updating access token: ${error}`);
    });
}



// Call the updateAccessToken function to get the initial access token
updateAccessToken();

// Event listener for generate button
generateButton.addEventListener("click", () => {
  audio.pause();
  const genre = genreSelect.value;
  fetch(`https://api.spotify.com/v1/search?type=track&q=genre:%22${genre}%22&limit=30`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tracks = data.tracks.items;
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const song = tracks[randomIndex];
      const songUrl = song.external_urls.spotify;
      outputField.innerHTML = `<div class="song-link-container"><a href="${songUrl}" target="_blank" class="song-link">${song.name} by ${song.artists[0].name}</a>`;
      const songLink = outputField.querySelector(".song-link");
      songLink.addEventListener("click", (event) => {
        event.preventDefault();
        const url = songLink.getAttribute("href");
        playAudio(url);

      });
    })
    .catch((error) => {
      console.error(error);
      outputField.innerHTML = "An error occurred while generating a random song. Please try again later.";
    });
});

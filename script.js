const generateButton = document.getElementById("generate-button");
const genreSelect = document.getElementById("genre-select");
const outputField = document.getElementById("output-field");
outputField.classList.add("generated-link");

const accessToken = ' BQCuS4hG8XuA6KGnFJ_fRb2sBx5-Gnk3S6rR7-nzBy4q7ubhnY_H_hGYCEtKfgtNoqVJcTQBiJCdZk91YDVmESXRIqRKFb6GKxWV6S_2mRzgMwl3tYD8';
const clientId = '2908a1e2d9a7493db80ff866388c4a28';
const clientSecret = 'f6c8c829d50442a9928b69bedbcb310e';

function getRandomSong(genre) {
  const url = `https://api.spotify.com/v1/search?type=track&q=genre:%22${genre}%22&limit=30`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tracks = data.tracks.items;
      const randomIndex = Math.floor(Math.random() * tracks.length);
      return tracks[randomIndex];
    });
}

generateButton.addEventListener("click", () => {
  const genre = genreSelect.value;
  getRandomSong(genre)
    .then((song) => {
      const songUrl = song.external_urls.spotify;
      outputField.innerHTML = `<a href="${songUrl}" target="_blank">${song.name} by ${song.artists[0].name}</a>`;
    })
    .catch((error) => {
      console.error(error);
      outputField.innerHTML = "An error occurred while generating a random song. Please try again later.";
    });
});

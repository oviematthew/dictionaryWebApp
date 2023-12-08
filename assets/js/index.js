var word = 'teacher';
var apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log(result);
        console.log(result[0].phonetic);
        console.log(result[0].word);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });



    // Get the text area and speak button elements
let textArea = document.getElementById("text");
let speakButton = document.getElementById("speak-button");

// Add an event listener to the speak button
speakButton.addEventListener("click", function() {
  // Get the text from the text area
  let text = textArea.value;

  // Create a new SpeechSynthesisUtterance object
  let utterance = new SpeechSynthesisUtterance();

  // Set the text and voice of the utterance
  utterance.text = text;
  utterance.voice = window.speechSynthesis.getVoices()[5];

  // Speak the utterance
  window.speechSynthesis.speak(utterance);
});



 // Function to update the paragraph with the user's country and flag
 function updateLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Use OpenStreetMap Nominatim API to get the location details based on coordinates
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    // Make a request to the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Check if the response is successful and has address details
            if (data && data.address && data.address.country_code) {
                const country = data.address.country;
                const countryFlagCode = data.address.country.toLowerCase();

                // Update the paragraph with the country name
                document.getElementById('locationParagraph').textContent = `Country: ${country}`;

                // Fetch the country flag
                const flagUrl = `https://www.countryflags.com/wp-content/uploads/${countryFlagCode}-flag-png-large.png`;
                document.getElementById('countryFlag').src = flagUrl;
                document.getElementById('countryFlag').alt = `Flag of ${country}`;
            } else {
                // Display an error message if the response is not as expected
                document.getElementById('locationParagraph').textContent = 'Error getting country information.';
            }
        })
        .catch(error => {
            // Display an error message if there is an issue with the API request
            document.getElementById('locationParagraph').textContent = 'Error getting country information.' + error;
        });
}

// Function to handle errors in geolocation
function handleLocationError(error) {
    let errorMessage = 'Error getting location: ';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage += 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorMessage += 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage += 'An unknown error occurred.';
            break;
    }

    // Display the error message
    document.getElementById('locationParagraph').textContent = errorMessage;
}

// Check if the Geolocation API is supported by the browser
if (navigator.geolocation) {
    // Get the user's location
    navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError);
} else {
    // Display an error message if Geolocation is not supported
    document.getElementById('locationParagraph').textContent = 'Geolocation is not supported by your browser.';
}
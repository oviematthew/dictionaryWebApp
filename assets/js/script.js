import wordsDB from "./db.js";

// Service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then((registration) => {
            console.log('Registration successful. Scope is:', registration.scope);
        })
        .catch((error) => {
            console.log('Registration failed. Error:', error);
        });
} else {
    console.log("Service workers not supported");
}

document.addEventListener('DOMContentLoaded', function () {
    const sendNotifBtn = document.getElementById('sendNotifBtn');
    

    let isNotificationPermissionGranted = false;


    function checkNotificationPermission() {
        if (Notification.permission === "granted") {
            isNotificationPermissionGranted = true;
           
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    isNotificationPermissionGranted = true;
                    
                }
            });
        }
    }

    checkNotificationPermission();

   // Request permission on button click
   sendNotifBtn.addEventListener('click', function () {
    Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
            isNotificationPermissionGranted = true;
        }
    });
});

// Show notification on button click
sendNotifBtn.addEventListener('click', function () {
    const title = currentWord;  
    const body = wordDefinition.textContent; 

    if (title === "") {
        alert("There is no word fetched");
    } else {
        const options = {
            body: body,
            icon: 'assets/logo-white-bg.png',
            actions: [
                {
                    action: 'agree',
                    title: 'Agree'
                },
                {
                    action: 'disagree',
                    title: 'Disagree'
                }
            ]
        };

        // if granted send notification
        if (isNotificationPermissionGranted) {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(title, options);
            });
        }
    }
});

// Your existing code...

// Listen for postMessage
navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message received from service worker:', event.data.message);
    displayDiv.innerText = event.data.message;
});
});




// Function to get current date
function formatDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Get the current date and set it in the specified <p> tag
const currentDate = new Date();
const formattedDate = formatDate(currentDate);
document.getElementById('todaysDate').textContent = formattedDate;



// Word of the Day function
let englishWords = [
    "apple", "banana", "orange", "grape", "strawberry", "watermelon", "blueberry", "kiwi", "peach", "mango",
    "dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle", "parrot", "snake", "lizard",
    "car", "bus", "train", "bicycle", "motorcycle", "airplane", "boat", "taxi", "subway", "truck",
    "happy", "sad", "angry", "excited", "bored", "surprised", "tired", "relaxed", "nervous", "confused",
    "book", "movie", "music", "art", "dance", "theater", "poetry", "photography", "sculpture", "painting",
    "mountain", "beach", "forest", "desert", "river", "lake", "ocean", "island", "cave", "canyon",
    "computer", "phone", "tablet", "keyboard", "mouse", "monitor", "printer", "router", "software", "hardware",
    "coffee", "tea", "water", "juice", "soda", "milk", "smoothie", "wine", "beer", "cocktail",
    "summer", "winter", "spring", "autumn", "sun", "rain", "snow", "wind", "clouds", "storm",
    "math", "science", "history", "language", "art", "music", "physical_education", "geography", "literature", "computer_science",
    "friend", "family", "colleague", "neighbor", "teacher", "boss", "classmate", "stranger", "customer", "client",
    "zebra", "xylophone", "waffle", "violet", "umbrella", "tangerine", "sunset", "rocket", "quasar", "puzzle",
    "octopus", "noodle", "moose", "lighthouse", "kangaroo", "jazz", "hologram", "giraffe", "festival", "elephant",
  ];

  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}



var partOfSpeech = document.getElementById('partOfSpeech')
var wordDefinition = document.getElementById('wordDefinition')
var transcription = document.getElementById('transcription')
var word =  document.getElementById('featuredWord');
var currentWord = getRandomElement(englishWords)
word.textContent = currentWord
var speakBtn = document.getElementById('speakBtn')

// Add an event listener to the speak button
speakBtn.addEventListener("click", function () {
    
    // Create a new SpeechSynthesisUtterance object
    let utterance = new SpeechSynthesisUtterance();

    // Set the text and voice of the utterance
    utterance.text = currentWord;
    utterance.voice = window.speechSynthesis.getVoices()[5];

    // Speak the utterance
    window.speechSynthesis.speak(utterance);
});

var apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(currentWord)}`;



fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        partOfSpeech.textContent = result[0].meanings[0].partOfSpeech
        wordDefinition.textContent = result[0].meanings[0].definitions[0].definition
       transcription.textContent = result[0].phonetic
        

        console.log(result[0]);
    })
    .catch(error => {
        console.error('Error:', error.message);
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

                // Fetch the country flag
                const flagUrl = `https://www.countryflags.com/wp-content/uploads/${countryFlagCode}-flag-png-large.png`;

                // Change the flag image
                let flagImg = document.getElementById('countryFlag'); 
                flagImg.src = flagUrl;
                flagImg.alt = `Flag of ${country}`;
            } else {
                // Use default image if not displayed properly
                let flagImg = document.getElementById('countryFlag');
                flagImg.src = '/assets/anonymous.jpg';
                flagImg.alt = 'Anonymous Flag';
            }
        })
        .catch(error => {
            // Display an error message if there is an issue with the API request
           console.log(error)
        });
}

// Function to handle errors in geolocation
function handleLocationError(error) {
    let errorMessage = 'Error getting location: ';
    switch (error.code) {
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









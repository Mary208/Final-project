// Get elements
const form = document.getElementById('medication-form');
const medicationList = document.getElementById('medication-ul');

// Load medications from local storage
let medications = JSON.parse(localStorage.getItem('medications')) || [];

// Function to render the medication list
function renderMedications() {
    medicationList.innerHTML = ''; // Clear the current list
    medications.forEach((medication, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${medication.name}</span> - ${medication.dose} mg at ${medication.time} 
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>`;
        medicationList.appendChild(li);
    });
}

// Event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const medicationName = document.getElementById('medication-name').value;
    const dose = document.getElementById('dose').value;
    const time = document.getElementById('time').value;

    // Create a new medication object
    const newMedication = { name: medicationName, dose: dose, time: time };
    
    // Set reminder for the medication
    setReminder(time, medicationName);

    // Add new medication to medications array
    medications.push(newMedication);

    // Save medications array to localStorage
    localStorage.setItem('medications', JSON.stringify(medications));

    // Render updated list
    renderMedications();
    form.reset();
});

// Function to set reminder
function setReminder(medicationTime, medicationName) {
    const now = new Date();
    const medicationTimeObj = new Date(`${now.toDateString()} ${medicationTime}`);

    // Check if the time has already passed for today, if so, set it for tomorrow
    if (medicationTimeObj <= now) {
        medicationTimeObj.setDate(medicationTimeObj.getDate() + 1);
    }

    // Calculate the time difference
    const timeDifference = medicationTimeObj - now;

    setTimeout(function() {
        alert(`It's time to take your ${medicationName}!`);
    }, timeDifference);
}

// Event listener for delete button (inside the medication list)
medicationList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        medications.splice(index, 1); // Remove medication from the array
        localStorage.setItem('medications', JSON.stringify(medications)); // Update localStorage
        renderMedications(); // Re-render the list
    }
});

// Event listener for edit button (inside the medication list)
medicationList.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
        const index = event.target.getAttribute('data-index');
        const medication = medications[index];
        
        document.getElementById('medication-name').value = medication.name;
        document.getElementById('dose').value = medication.dose;
        document.getElementById('time').value = medication.time;

        // Remove the medication first so we can update it
        medications.splice(index, 1);
        localStorage.setItem('medications', JSON.stringify(medications));
        renderMedications();
    }
});

// Initial render of the list
renderMedications();


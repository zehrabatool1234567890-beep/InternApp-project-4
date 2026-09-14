// The address of your backend API
const API_URL = 'http://localhost:3000/interns';

// References to the HTML elements
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const addBtn = document.getElementById('addBtn');
const internsList = document.getElementById('internsList');

// This variable keeps track of which intern we are editing. 
// If it is null, we are adding a new intern. If it has an ID, we are updating.
let currentEditId = null;

// ==========================================
// 1. GET: Fetch and Display Interns
// ==========================================
async function fetchInterns() {
    try {
        const response = await fetch(API_URL);
        const interns = await response.json();

        // Clear the current list before rendering it again
        internsList.innerHTML = '';

        // Loop through the data and create an HTML card for each intern
        interns.forEach(intern => {
            const div = document.createElement('div');
            div.classList.add('intern-card');
            div.innerHTML = `
                <h3>${intern.name}</h3>
                <p>${intern.email}</p>
                <button class="edit-btn" onclick="editIntern('${intern._id}', '${intern.name}', '${intern.email}')">Edit</button>
                <button class="delete-btn" onclick="deleteIntern('${intern._id}')">Delete</button>
            `;
            internsList.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching interns:", error);
    }
}

// ==========================================
// 2. POST & PUT: Add New or Update Existing
// ==========================================
addBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Basic validation
    if (!name || !email) {
        alert('Please fill in both fields.');
        return;
    }

    try {
        // IF we have a currentEditId, we are UPDATING (PUT)
        if (currentEditId) {
            await fetch(`${API_URL}/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email })
            });

            // Reset the form back to "Add" mode
            currentEditId = null;
            addBtn.textContent = 'Start Learning';
            addBtn.style.backgroundColor = '#007BFF'; // Reset to original blue
            addBtn.style.color = 'white';

        }
        // OTHERWISE, we are CREATING a new intern (POST)
        else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email })
            });
        }

        // Clear the input boxes and refresh the list
        nameInput.value = '';
        emailInput.value = '';
        fetchInterns();

    } catch (error) {
        console.error("Error saving intern:", error);
        alert("Could not connect to the server. Is it running?");
    }
});

// ==========================================
// 3. Helper Function: Triggered by "Edit" Button
// ==========================================
function editIntern(id, name, email) {
    // Fill the input boxes with the selected intern's data
    nameInput.value = name;
    emailInput.value = email;

    // Store the ID so the main button knows to use PUT instead of POST
    currentEditId = id;

    // Change the main button to look like an "Update" button
    addBtn.textContent = 'Update Intern';
    addBtn.style.backgroundColor = '#ffc107'; // Change to yellow
    addBtn.style.color = 'black';
}

// ==========================================
// 4. DELETE: Remove an Intern
// ==========================================
async function deleteIntern(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Refresh the list after deleting
            fetchInterns();
        }
    } catch (error) {
        console.error("Error deleting intern:", error);
    }
}

// ==========================================
// Initial Load
// ==========================================
// Run this immediately when the page opens so the list populates
fetchInterns();

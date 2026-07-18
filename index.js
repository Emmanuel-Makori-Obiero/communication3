let allUsers = []; // Create an empty box to hold the list of users we get from the database.

async function fetchUsers() {
  // Create a special function that can pause and wait for internet data.
  const tableBody = document.getElementById("userTableBody"); // Find the table body element from your HTML.
  tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-gray-400">Loading live data...</td></tr>`; // Show "Loading..." text on screen.

  try {
    // Try running the database fetching sequence.
    const response = await fetch(
      "https://charity-minds-backend.onrender.com/api/v1/users",
    ); // Contact your Render API URL.
    const result = await response.json(); // Turn raw internet data into a clean JavaScript object.

    allUsers = Array.isArray(result) ? result : result.data || []; // Store the array inside our master allUsers variable.
    document.getElementById("totalUsersCount").textContent = allUsers.length; // Map to HTML id="totalUsersCount".
    filterTable(); // Run the filter function right away to draw the data.
  } catch (error) {
    // Catch network errors safely.
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-red-500">Failed to load data.</td></tr>`; // Print clean error message.
  }
}

// INTERLINK ROUTING: Instead of prompt boxes, redirect directly to the registration page form context
function handleAddNewUser() {
  window.location.href = "index.html";
}

function filterTable() {
  // Main sorting and presentation engine.
  const chosenGender = document.getElementById("genderFilter").value; // Read selection value from your HTML gender dropdown.
  const chosenDate = document.getElementById("dateFilter").value; // Read selection value from your HTML date dropdown.
  const tableBody = document.getElementById("userTableBody"); // Grab the row layout container.
  tableBody.innerHTML = ""; // Wipe out previous table canvas entries.
  let matchCount = 0; // Clear the match score tracker to zero.

  allUsers.forEach((user) => {
    // Inspect every profile entry in our list.
    const userGender = user.gender ? String(user.gender).toLowerCase() : ""; // Clean user gender data string to lowercase.
    const userCreated = user.createdAt ? String(user.createdAt) : ""; // Read timestamp string.
    const genderMatches = chosenGender === "all" || userGender === chosenGender; // Exact check logic match.
    const dateMatches =
      chosenDate === "all" || userCreated.includes(chosenDate); // Check if option string exists inside timeline text.

    if (genderMatches && dateMatches) {
      // If profile clears both logic tests...
      matchCount++; // Bump the match total up by one.
      const cleanDate = userCreated.includes("T")
        ? userCreated.split("T")[0]
        : userCreated; // Drop time segment at marker character 'T'.

      tableBody.innerHTML += `
        <tr class="hover:bg-slate-50 border-b border-gray-100 transition duration-150">
          <td class="py-4 font-medium text-slate-900">${user.firstName || ""}</td>
          <td class="py-4">${user.lastName || ""}</td>
          <td class="py-4 text-slate-500">${user.username || ""}</td>
          <td class="py-4 text-slate-500">${user.email || ""}</td>
          <td class="py-4 text-slate-500">${user.phone || ""}</td>
          <td class="py-4 text-slate-500">${user.dob || ""}</td>
          <td class="py-4 text-slate-500">${user.gender || ""}</td>
          <td class="py-4 text-xs font-mono text-slate-400">${cleanDate}</td>
        </tr>`; // Append layout rows dynamically to fill up table body.
    }
  });
  document.getElementById("filteredUsersCount").textContent = matchCount; // Map matching list counter to HTML.
}

// Event Listeners:
window.addEventListener("DOMContentLoaded", fetchUsers); // Download data once page is loaded.
document.getElementById("genderFilter").addEventListener("change", filterTable); // Recalculate tables on gender shift.
document.getElementById("dateFilter").addEventListener("change", filterTable); // Recalculate tables on date shift.
document.getElementById("addNew").addEventListener("click", handleAddNewUser); // Map to your HTML id="addNew" button.

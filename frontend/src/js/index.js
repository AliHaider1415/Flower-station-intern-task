const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const addReminderButton = document.getElementById('addReminder');
    const eventForm = document.getElementById('eventForm');
    const reminderContainer = document.getElementById('reminderContainer');

    let reminderCount = 0;

    function createReminder(index) {
      return `
        <div class="reminder-item bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
          <h3 class="text-lg font-semibold mb-2">Reminder ${index}</h3>
          <label class="block text-sm font-medium text-gray-700">Event Name</label>
          <input type="text" name="eventName${index}" required class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">

          <label class="block text-sm font-medium text-gray-700 mt-2">Event Date</label>
          <input type="date" name="eventDate${index}" required class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">

          <label class="block text-sm font-medium text-gray-700 mt-2">Customer Email</label>
          <input type="email" name="customerEmail${index}" required class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">

          <label class="block text-sm font-medium text-gray-700 mt-2">Event Type</label>
          <select name="eventType${index}" class="event-type mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" onchange="toggleOtherInput(this)">
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="otherEventType${index}" placeholder="Specify Event Type" class="other-event hidden mt-2 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
        </div>`;
    }

    function toggleOtherInput(selectElement) {
      let otherInput = selectElement.parentElement.querySelector(".other-event");
      otherInput.classList.toggle("hidden", selectElement.value !== "Other");
    }

    openModalButton.addEventListener('click', () => {
      modal.classList.remove('modal-hidden');
      reminderContainer.innerHTML = createReminder(1);
      reminderCount = 1;
    });

    closeModalButton.addEventListener('click', () => {
      modal.classList.add('modal-hidden');
    });

    addReminderButton.addEventListener('click', () => {
      if (reminderCount < 3) {
        reminderCount++;
        reminderContainer.innerHTML += createReminder(reminderCount);
      } else {
        alert('You can only add up to 3 reminders.');
      }
    });

    async function loadReminders() {
        try {
          const response = await fetch("/data.json"); // Fetch from JSON file (or API endpoint)
          const reminders = await response.json();
      
          const remindersContainer = document.getElementById("remindersList");
          remindersContainer.innerHTML = ""; // Clear existing reminders
      
          reminders.forEach((reminder, index) => {
            const reminderHTML = `
              <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-4">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <i class="fas fa-calendar-alt text-blue-500"></i> 
                    ${reminder.eventName}
                </h3>
                <p class="text-gray-600 mt-2 flex items-center gap-2">
                    <i class="fas fa-calendar-day text-blue-400"></i> 
                    <span class="font-medium">Date:</span> ${reminder.eventDate}
                </p>
                <p class="text-gray-600 mt-2 flex items-center gap-2">
                    <i class="fas fa-envelope text-red-400"></i> 
                    <span class="font-medium">Email:</span> ${reminder.customerEmail}
                </p>
                <p class="text-gray-600 mt-2 flex items-center gap-2">
                    <i class="fas fa-tag text-green-400"></i> 
                    <span class="font-medium">Type:</span> 
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        ${reminder.eventType}
                    </span>
                </p>
            </div>`;
            remindersContainer.innerHTML += reminderHTML;
          });
        } catch (error) {
          console.error("Error loading reminders:", error);
        }
      }
    
    // Load reminders when the page loads
    window.onload = loadReminders;
      

    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const formData = new FormData(eventForm);
        const data = Object.fromEntries(formData.entries());

        console.log("Data: ", data);
    
        try {
            const response = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            alert(result.message);
            if (result.success) eventForm.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to add reminder.");
        }
    });
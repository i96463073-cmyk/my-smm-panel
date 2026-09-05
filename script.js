// We will connect this to your secure API later

const API_URL = "https://YOUR-WORKER.workers.dev";

// Get elements from the website
const serviceSelect = document.getElementById("serviceSelect");
const linkInput = document.getElementById("link");
const quantityInput = document.getElementById("quantity");
const orderButton = document.getElementById("orderButton");
const message = document.getElementById("message");

// Load services
async function loadServices() {
  serviceSelect.innerHTML = '<option value="">Loading services...</option>';

  try {
    const response = await fetch(`${API_URL}/services`);
    const services = await response.json();

    serviceSelect.innerHTML = '<option value="">Select a service</option>';

    services.forEach((service) => {
      const option = document.createElement("option");

      option.value = service.service;
      option.textContent = `${service.name} - Rate: ${service.rate}`;

      option.dataset.min = service.min;
      option.dataset.max = service.max;

      serviceSelect.appendChild(option);
    });

  } catch (error) {
    console.error(error);

    serviceSelect.innerHTML =
      '<option value="">Services will be available after API setup</option>';
  }
}

// Place an order
orderButton.addEventListener("click", async () => {

  const service = serviceSelect.value;
  const link = linkInput.value;
  const quantity = quantityInput.value;

  if (!service || !link || !quantity) {
    message.textContent = "Please fill in all fields.";
    return;
  }

  message.textContent = "Creating order...";

  try {
    const response = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service,
        link,
        quantity
      })
    });

    const data = await response.json();

    if (data.order) {
      message.textContent =
        `Order created successfully! Order ID: ${data.order}`;
    } else {
      message.textContent =
        data.error || "Could not create the order.";
    }

  } catch (error) {
    console.error(error);
    message.textContent =
      "API is not connected yet.";
  }

});

// Start loading services
loadServices();

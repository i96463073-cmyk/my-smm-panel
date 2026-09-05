
document.addEventListener("DOMContentLoaded", async () => {
  const serviceSelect = document.querySelector("select");

  if (!serviceSelect) return;

  try {
    const response = await fetch("/api/services");
    const services = await response.json();

    if (Array.isArray(services) && services.length > 0) {
      serviceSelect.innerHTML = '<option value="">Select a service</option>';

      services.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.service;
        option.textContent = `${item.name} ($${item.rate} per 1000)`;
        serviceSelect.appendChild(option);
      });
    } else {
      serviceSelect.innerHTML = '<option value="">Unable to load services</option>';
    }
  } catch (error) {
    serviceSelect.innerHTML = '<option value="">Error loading services</option>';
  }
});

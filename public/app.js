const pizzaGrid = document.getElementById("pizza-grid");
const pizzaSelect = document.getElementById("pizza-select");
const orderForm = document.getElementById("order-form");
const receipt = document.getElementById("order-receipt");

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

const loadPizzas = async () => {
  const response = await fetch("/api/pizzas");
  const pizzas = await response.json();
  pizzaGrid.innerHTML = "";
  pizzaSelect.innerHTML = "";

  pizzas.forEach((pizza, index) => {
    const card = document.createElement("article");
    card.className = "pizza-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <span class="pizza-card__badge">Hot pick</span>
      <h3>${pizza.name}</h3>
      <p>${pizza.description}</p>
      <span class="pizza-card__price">${formatPrice(pizza.price_cents)}</span>
    `;
    pizzaGrid.appendChild(card);

    const option = document.createElement("option");
    option.value = pizza.id;
    option.textContent = `${pizza.name} · ${formatPrice(pizza.price_cents)}`;
    pizzaSelect.appendChild(option);
  });
};

const updateReceipt = (order) => {
  receipt.innerHTML = `
    <h3>Order confirmed</h3>
    <div class="receipt__item">
      <strong>${order.customer_name}</strong>
      <span>Order #${order.id}</span>
      <span>Qty ${order.quantity} · Total ${formatPrice(order.total_cents)}</span>
      <span>Pickup in 15 minutes</span>
    </div>
  `;
};

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  const payload = Object.fromEntries(formData.entries());
  payload.quantity = Number(payload.quantity);

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    receipt.innerHTML = "<h3>Order error</h3><p>Please try again.</p>";
    return;
  }

  const order = await response.json();
  updateReceipt(order);
  orderForm.reset();
});

loadPizzas();

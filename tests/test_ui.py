import os


def _base_url(config_base_url: str | None) -> str:
    # pytest-playwright exposes base_url via pytest.ini; allow env override.
    return os.getenv("BASE_URL", config_base_url or "http://localhost:3000")


def test_homepage_loads_and_lists_pizzas(page, base_url):
    page.goto(_base_url(base_url), wait_until="networkidle")

    page.get_by_role("heading", name="Featured Pizzas").is_visible()

    cards = page.locator("#pizza-grid .pizza-card")
    assert cards.count() >= 1


def test_can_place_order_and_see_receipt(page, base_url):
    page.goto(_base_url(base_url), wait_until="networkidle")

    # Wait for pizzas to load into the select.
    select = page.locator("#pizza-select")
    page.wait_for_function("() => document.querySelector('#pizza-select')?.options.length > 0")

    page.get_by_label("Name").fill("Test Customer")
    # Ensure a pizza is selected (first option by default after load).
    if select.locator("option:selected").count() == 0:
        select.select_option(index=0)

    page.get_by_label("Quantity").fill("2")
    page.get_by_role("button", name="Fire it up").click()

    receipt = page.locator("#order-receipt")
    receipt.get_by_role("heading", name="Order confirmed").wait_for()
    assert receipt.get_by_text("Order #").is_visible()
    assert receipt.get_by_text("Qty 2").is_visible()

import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { menuArray } from "./data.js";

const orderListElement = document.getElementById("menu-order");
const orderSection = document.getElementById("order-section");
const orderTotalHolder = document.getElementById("order-total-holder");
const completeOrderBtn = document.getElementById("complete-order-btn");
const modal = document.getElementById("modal");
const makePaymentForm = document.getElementById("make-payment-form");
const thankYouMsg = document.getElementById("thank-you-msg");

document.addEventListener("click", function (e) {
  if (e.target.dataset.additem) {
    handleAddMenuItemClick(e.target.dataset.additem);
  } else if (e.target.dataset.removeItem) {
    handleRemoveMenuItemClick(e.target.dataset.removeItem);
  }
});

completeOrderBtn.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

makePaymentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  orderSection.classList.add("hidden");
  const paymentFormData = new FormData(makePaymentForm);
  const name = paymentFormData.get("customerName");
  thankYouMsg.innerHTML = `<p class="thank-you-msg-txt">Thanks, ${name}! Your order is on it's way!</p>`;
  thankYouMsg.classList.remove("hidden");
  thankYouMsg.style.display = "flex";
});

let orderItems = [];

function handleAddMenuItemClick(addedItemId) {
  orderSection.classList.remove("hidden");
  let menuItemToAdd = menuArray.find(function (menuItem) {
    return menuItem.id === parseFloat(addedItemId);
  });
  orderItems.push({ ...menuItemToAdd, uuid: uuidv4() });
  renderOrderedItems();
  renderTotal();
}

function handleRemoveMenuItemClick(removedItemId) {
  const itemToRemove = orderItems.findIndex(function (orderItem) {
    return orderItem.uuid === removedItemId;
  });
  if (itemToRemove > -1) {
    orderItems.splice(itemToRemove, 1);
  }
  renderOrderedItems();
  renderTotal();
  if (orderItems.length === 0) {
    orderSection.classList.add("hidden");
  }
}

function renderOrderedItems() {
  if (orderItems) {
    let menuItemElement = ``;
    orderItems.forEach(function (orderedItem) {
      menuItemElement += `
    <li class="ordered-item-text">
      <p>${orderedItem.name}</p>
      <p class="remove-btn" data-remove-item="${orderedItem.uuid}">remove</p>
      <p class="ordered-item-price-text">${orderedItem.price}</p>
    </li>
    `;
    });
    return (orderListElement.innerHTML = menuItemElement);
  }
}

function renderTotal() {
  let menuTotal = `
  <p class="total-price-label">Total Price</p>
  <p class="ordered-items-price-text">${calculateTotal()}</p>
  `;
  orderTotalHolder.innerHTML = menuTotal;
}

function calculateTotal() {
  const sum = orderItems.reduce(function (accumulator, object) {
    return accumulator + object.price;
  }, 0);
  return sum;
}

function getMenuFeedHtml() {
  let menuFeedHtml = ``;
  menuArray.forEach(function (menuItem) {
    menuFeedHtml += `
    <div class="menu-item-wrapper">
            <div class="main-menu-content">
                <div>
                    <div class="menu-item-emoji">${menuItem.emoji}</div>
                </div>
                <div class="menu-item-details">   
                    <h4 class="menu-item-name">${menuItem.name}</h4>
                    <p class="menu-item-ingredients">${menuItem.ingredients.join(
                      ", "
                    )} </p>
                    <p class="menu-item-price">$${menuItem.price}</p>
                </div>
            </div>
            <button class="add-menu-item-btn" data-additem="${
              menuItem.id
            }">+</button>
    </div>
    `;
  });
  return menuFeedHtml;
}

function render() {
  document.getElementById("menu-items").innerHTML = getMenuFeedHtml();
}

render();

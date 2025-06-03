const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
   updateCartModal();
   cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora dele
cartModal.addEventListener("click", function(event) {
   if (event.target === cartModal) {
      cartModal.style.display = "none";
   }
});

// Botão de fechar
closeModalBtn.addEventListener("click", function() {
   cartModal.style.display = "none";
});

// Adicionar itens no carrinho
menu.addEventListener("click", function(event) {
   const parentButton = event.target.closest(".add-to-cart-btn");

   if (parentButton) {
      const name = parentButton.getAttribute("data-name");
      const price = parseFloat(parentButton.getAttribute("data-price"));

      addToCart(name, price);
   }
});

// Função para adicionar ao carrinho
function addToCart(name, price) {
   const existingItem = cart.find(item => item.name === name);

   if (existingItem) {
      existingItem.quantity += 1;
   } else {
      cart.push({
         name,
         price,
         quantity: 1,
      });
   }

   updateCartModal();
}

// Função para remover do carrinho
function removeFromCart(name) {
   cart = cart.filter(item => item.name !== name);
   updateCartModal();
}

// Atualiza o carrinho no modal
function updateCartModal() {
   cartItemsContainer.innerHTML = "";
   let total = 0;

   cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

      cartItemElement.innerHTML = `
         <div class="flex items-center justify-between">
            <div>
               <p class="font-bold">${item.name}</p>
               <p>Qtd: ${item.quantity}</p>
               <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="text-black hover:underline">Remover</button>
         </div>
      `;

      const removeBtn = cartItemElement.querySelector("button");
      removeBtn.addEventListener("click", function() {
         removeFromCart(item.name);
      });

      cartItemsContainer.appendChild(cartItemElement);

      total += item.price * item.quantity;
   });

   cartTotal.innerText = total.toFixed(2);
   cartCounter.innerText = cart.length;
}

// Checkout - Verificar se endereço foi preenchido
checkoutBtn.addEventListener("click", function() {
   const address = addressInput.value.trim();

const isOpen = checkRestaurantOpen();
if(!isOpen){
Toastify({
  text: "Ops, o restaurante está fechado!",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "#ef4444",
  },
  onClick: function(){} // Callback after click
}).showToast();

return;
}
   if (!address) {
      addressWarn.classList.remove("hidden");
      return;
   }

   addressWarn.classList.add("hidden");

   // Enviar o pedido para API do WhatsApp
   const cartItems = cart.map((item) => {
      return (
         ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} `
      )
   }).join("");

   const message = encodeURIComponent(`${cartItems} Endereço: ${address}`);
   const phone = "34996807646";

   window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

   // Limpar carrinho depois de enviar
   cart = [];
   updateCartModal();
   cartModal.style.display = "none";
   addressInput.value = "";

   alert("Pedido enviado pelo WhatsApp!");
});

// Verificar a hora e manipular o card do horário
function checkRestaurantOpen() {
   const data = new Date();
   const hora = data.getHours();
   return hora >= 18 && hora < 22;
   // true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
   spanItem.classList.remove("bg-red-500");
   spanItem.classList.add("bg-green-600");
} else {
   spanItem.classList.remove("bg-green-600");
   spanItem.classList.add("bg-red-500");
}
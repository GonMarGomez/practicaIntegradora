let finishProcessButton = document.querySelector(".finishButton");
if (finishProcessButton) {
  finishProcessButton.addEventListener("click", function () {
    fetch(`/tickets/finish`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = '/products'
        } else {
          console.error("Error al eliminar el ticket.");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let finishPurchaseButton = document.querySelector(".purchase");
  if (finishPurchaseButton) {
    finishPurchaseButton.addEventListener("click", function () {
      fetch("/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })      
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Error al finalizar la compra.");
        }
      })
      .then(function (data) {
        console.log("Ticket generado:", data);
        window.location.href = '/ticket';
      })
      .catch(function (error) {
        console.error("Error al realizar la solicitud:", error);
      });
    });
  }
});



const cartId = window.location.pathname.split('/').pop();

const removeButtons = document.querySelectorAll('.remove-from-cart');

removeButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const productId = event.target.dataset.productId;
    const response = await fetch(`/api/cart/${cartId}/product/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`Producto ${productId} eliminado del carrito`);
      location.reload();
    } else {
      console.error('Error al eliminar el producto del carrito');
    }
  });
});

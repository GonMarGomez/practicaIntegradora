
document.addEventListener("DOMContentLoaded", function () {
  let addToCartButtons = document.querySelectorAll(".addToCart");
  
  addToCartButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
          event.preventDefault();
          console.log('soy el click');
          let productId = button.getAttribute("data-product-id");

          fetch("/addToCart", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ productId: productId }) 
          })
          .then(function (response) {
              if (response.ok) {
                  alert("Producto agregado al carrito con éxito.");
              } else {
                  console.error("Error al agregar el producto al carrito.");
              }
          })
          .catch(function (error) {
              console.error("Error al realizar la solicitud:", error);
          });
      });
  });
});

let finishProcessButton = document.querySelector(".finishButton");
  if (finishProcessButton){
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



let finishPurchaseButton = document.querySelector(".purchase");
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



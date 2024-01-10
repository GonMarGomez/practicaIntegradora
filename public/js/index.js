document.addEventListener("DOMContentLoaded", function () {
  let addToCartButtons = document.querySelectorAll(".addToCart");

  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
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

  // Lógica para el nuevo botón "Eliminar"
  let deleteProductButtons = document.querySelectorAll(".deleteProductButton");

  deleteProductButtons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
        event.preventDefault();
        let productId = button.getAttribute("data-product-id");
        try {
          const response = await fetch("/api/product/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId: productId })
          });
            if (response.ok) {
                const result = await response.json();
                console.log('Server Response:', result); 
            } else {
                const errorText = await response.text(); 
                console.error('Error al eliminar el producto:', errorText);
            }
        } catch (error) {
            console.error("Error al procesar la solicitud DELETE:", error);
        }
    });
});


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
});

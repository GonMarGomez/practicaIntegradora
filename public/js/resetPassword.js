    document.addEventListener("DOMContentLoaded", function () {
        const resetPasswordForm = document.getElementById("resetPasswordForm");
        const newPasswordInput = document.getElementById("newPassword");
        const resetPasswordBtn = document.getElementById("resetPasswordBtn");
        const successMessageContainer = document.getElementById("successMessageContainer");
        const errorMessageContainer = document.getElementById("error-message");


        if (resetPasswordForm && newPasswordInput && resetPasswordBtn) {
            newPasswordInput.addEventListener("input", function () {
                const newPassword = newPasswordInput.value;
         
                const isValidPassword = newPassword.length >= 8; 
                resetPasswordBtn.disabled = !isValidPassword;
            });
    
            resetPasswordForm.addEventListener("submit", async function (event) {
                event.preventDefault();
                const tokenMatch = window.location.pathname.match(/\/forgot-password\/reset-password\/(.+)/);
                const token = tokenMatch ? tokenMatch[1] : null;
                
                if (!token) {
                    console.error("Token no encontrado en la URL");
                    return;
                }
                const newPassword = newPasswordInput.value;
                
                const response = await fetch(`/forgot-password/reset-password/${token}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newPassword: newPassword }),
                });
    
                if (response.ok) {
                    successMessageContainer.style.display = "block";
                    resetPasswordForm.style.display = "none";
                } else {
                    errorMessageContainer.innerText = "La contraseña debe ser diferente a la actual, ingresa una nueva contraseña.";
                }
            });
        } else {
            console.error("Elementos no encontrados");
        }
    });
    
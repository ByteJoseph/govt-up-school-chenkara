document.getElementById('login-form').addEventListener("submit", async function (e) {
    e.preventDefault();

    const adminID = document.getElementById('admin-id').value;
    const adminPassword = document.getElementById('admin-password').value;
    const errorPopup = document.getElementById('error-popup');


    try {
        const response = await fetch(
          "http://localhost:4000/adminaccess/security/adminlogin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ adminID, adminPassword }),
          }
        );
  
        const result = await response.json();
  
        if (result.success) {
          console.log("Redirecting to:", result.redirectUrl);
          window.open(result.redirectUrl, "_blank");
        } else {
          errorPopup.classList.add("show");
          setTimeout(function () {
            errorPopup.classList.remove("show");
          }, 3000);
        }
  
      } catch (error) {
          console.error("Error Occured");
      }
})
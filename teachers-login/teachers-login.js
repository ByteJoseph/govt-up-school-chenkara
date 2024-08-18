document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const errorPopup = document.getElementById("errorPopup");
    const teacherID = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "http://localhost:4000/teachers/teachers-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherID, password }),
        }
      );

      const result = await response.json();

      if (result.success) {
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
  });

const baseURL = 'https://govt-up-school-chenkara.onrender.com';

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const errorPopup = document.getElementById("errorPopup");
    const studentID = document.getElementById("studentID").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        `${baseURL}/students/student-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentID, password }),
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
  });

const body = document.body;
const popup = document.getElementById('signup-popup-container');


document.getElementById("close-popup").addEventListener("click", function () {
  body.style.overflow = "auto";
  document.getElementById("signup-popup-container").style.display = "none";
});

document
  .getElementById("createNewTeacher")
  .addEventListener("click", function () {
    body.style.overflow = "hidden";
    document.getElementById("signup-popup-container").style.display = "flex";
  });

document.getElementById("signup-form").onsubmit = async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const trclass = document.getElementById("class").value;
  const password = document.getElementById("password").value;
  const mobileNumber = document.getElementById("mobile").value;


  const teacherData = {
    name: name,
    class: trclass,
    password: password,
    mobileNumber: mobileNumber,
  };

  try {
    const response = await fetch(
      "http://localhost:4000/adminaccess/createnewteacher/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      }
    );

    console.log("post submitted for creating new teacher");

    if (response.ok) {
      const result = await response.json();
      alert('teacher profile created successfully');
      
      body.style.overflow = "auto";
      popup.style.display = "none";
      this.reset();
    } else {
      alert("operation failed");
      console.error("Failed to create teacher:", response.statusText);
      body.style.overflow = "auto";
      popup.style.display = "none";
      this.reset();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

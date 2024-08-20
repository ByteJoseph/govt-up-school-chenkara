const baseURL = 'https://govt-up-school-chenkara.onrender.com';
const urlParams = new URLSearchParams(window.location.search);
const teacherID = urlParams.get("teacherID");
const body = document.getElementById("body");

if (teacherID) {
  console.log("Logged in Teacher ID:", teacherID);
  getTeacherById(teacherID);
} else {
  body.style.display = "none";
}

// Utility function to escape HTML content
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getTeacherById(teacherID) {
  try {
    const response = await fetch(`${baseURL}/teachers/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teacherID }),
    });

    if (!response.ok) {
      throw new Error("Teacher not found");
    }

    const teacherData = await response.json();
    saveTeacherData(teacherData);
    updateDOM();
    fetchAndDisplayStudents();
  } catch (error) {
    console.error("Error fetching teacher:", error);
  }
}

const globalVariables = {
  teacherName: null,
  teacherClass: null,
  teacherMobileNumber: null,
};

function saveTeacherData(teacherData) {
  globalVariables.teacherName = teacherData.name;
  globalVariables.teacherClass = teacherData.class;
  globalVariables.teacherMobileNumber = teacherData.mobileNumber;
}

function updateDOM() {
  const teacherNameView = document.getElementById("teacherName");
  teacherNameView.innerHTML = escapeHtml(globalVariables.teacherName);

  document.getElementById("trname").innerText = escapeHtml(globalVariables.teacherName);
  document.getElementById("trclass").innerText = escapeHtml(globalVariables.teacherClass);
  document.getElementById("trNumber").innerText = escapeHtml(globalVariables.teacherMobileNumber);
  document.getElementById("trcode").innerText = escapeHtml(teacherID);
}

let popup = document.getElementById("create-student-popup");
let btn = document.getElementById("createStudentBtn");
let closeBtn = document.getElementsByClassName("close-btn")[0];

btn.onclick = function () {
  body.style.overflow = "hidden";
  popup.style.display = "flex";
};

closeBtn.onclick = function () {
  body.style.overflow = "auto";
  popup.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

document.getElementById("studentForm").onsubmit = async function (e) {
  e.preventDefault();

  const studentName = escapeHtml(document.getElementById("studentName").value);
  const studentClass = globalVariables.teacherClass;
  const studentGender = escapeHtml(document.querySelector('input[name="gender"]:checked').value);
  const motherName = escapeHtml(document.getElementById("motherName").value);
  const fatherName = escapeHtml(document.getElementById("fatherName").value);
  const motherNumber = escapeHtml(document.getElementById("motherPhone").value);
  const fatherNumber = escapeHtml(document.getElementById("fatherPhone").value);

  const studentData = {
    studentName,
    studentClass,
    studentGender,
    motherName,
    fatherName,
    motherNumber,
    fatherNumber,
  };

  try {
    const response = await fetch(`${baseURL}/teachers/createnewstudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (response.ok) {
      const result = await response.json();
      showStudentProfileCreationSuccessPopup(studentName);
      popup.style.display = "none";
      this.reset();
    } else {
      alert("Operation failed");
      console.error("Failed to create student:", response.statusText);
      body.style.overflow = "auto";
      popup.style.display = "none";
      this.reset();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function showStudentProfileCreationSuccessPopup(studentName) {
  const successPopupElement = document.getElementById("student-profile-creation-success-popup");
  const successMessageElement = document.getElementById("student-profile-creation-success-message");
  const okButtonElement = document.getElementById("student-profile-creation-success-ok-button");

  successMessageElement.textContent = `Profile for ${escapeHtml(studentName)} created successfully!`;

  body.style.overflow = "hidden";
  successPopupElement.style.display = "flex";

  okButtonElement.onclick = function () {
    body.style.overflow = "auto";
    successPopupElement.style.display = "none";
    window.location.reload();
  };
}

const containerElement = document.getElementById("student-container");

async function fetchAndDisplayStudents() {
  try {
    const studentClass = globalVariables.teacherClass;

    if (isNaN(studentClass)) {
      throw new Error("Invalid student class");
    }

    const response = await fetch(`${baseURL}/teachers/fetchstudentsbyclass?studentClass=${studentClass}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const students = await response.json();
    containerElement.innerHTML = "";

    students.forEach((student) => {
      const studentDiv = document.createElement("div");
      studentDiv.className = "student-div";

      const nameElement = document.createElement("h3");
      nameElement.textContent = escapeHtml(student.studentName);

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "student-buttons";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.textContent = "Delete";

      if (student._id) {
        deleteButton.dataset.studentId = student._id;
      } else {
        console.error("No student ID found for:", student);
      }

      deleteButton.onclick = function () {
        showDeleteConfirmationPopup(student._id, student.studentName);
      };

      buttonsDiv.appendChild(deleteButton);

      studentDiv.appendChild(nameElement);
      studentDiv.appendChild(buttonsDiv);

      containerElement.appendChild(studentDiv);
    });
  } catch (error) {
    console.error("Error fetching student names:", error);
    alert("Failed to fetch student names. Please try again later.");
  }
}

function showDeleteConfirmationPopup(studentId, studentName) {
  const deletePopupElement = document.getElementById("delete-confirmation-popup");
  const deleteMessageElement = document.getElementById("delete-confirmation-message");
  const deleteButtonElement = document.getElementById("delete-confirmation-delete-button");
  const closeButtonElement = document.getElementById("delete-confirmation-close-button");

  deleteMessageElement.textContent = `Are you sure you want to delete ${escapeHtml(studentName)} from your students list?`;

  deletePopupElement.style.display = "flex";
  body.style.overflow = "hidden";

  closeButtonElement.onclick = function () {
    deletePopupElement.style.display = "none";
    body.style.overflow = "auto";
  };

  deleteButtonElement.onclick = async function () {
    try {
      const response = await fetch(`${baseURL}/teachers/deletestudent/${studentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Student profile for ${escapeHtml(studentName)} deleted successfully`);
        deletePopupElement.style.display = "none";
        fetchAndDisplayStudents();
      } else {
        console.error("Failed to delete student profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting student profile:", error);
    }

    body.style.overflow = "auto";
  };
}

const uniqueStudentList = [];

async function fetchUniqueStudents() {
  try {
    const classId = globalVariables.teacherClass;
    const response = await fetch(`${baseURL}/teachers/fetchstudentsbyclass?studentClass=${classId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch students");

    const students = await response.json();
    uniqueStudentList.length = 0;
    uniqueStudentList.push(...students);

    renderUniqueStudentsForAttendance();
  } catch (error) {
    console.error("Error fetching students:", error);
    alert("Failed to fetch students. Please try again later.");
  }
}

function renderUniqueStudentsForAttendance() {
  const studentListContainer = document.getElementById("unique-student-list");

  if (!studentListContainer) {
    console.error('Element with ID "unique-student-list" not found.');
    return;
  }

  function displayTodaysDate() {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString(undefined, options);

    document.querySelector("#todays-date h3").textContent = formattedDate;
  }

  displayTodaysDate();

  studentListContainer.innerHTML = "";
  uniqueStudentList.forEach((student) => {
    const studentDiv = document.createElement("div");
    studentDiv.className = "unique-student-div";

    const nameElement = document.createElement("h3");
    nameElement.textContent = escapeHtml(student.studentName);

    const attendanceCheckbox = document.createElement("input");
    attendanceCheckbox.type = "checkbox";
    attendanceCheckbox.className = "attendance-checkbox";
    attendanceCheckbox.dataset.studentId = student._id;

    studentDiv.appendChild(nameElement);
    studentDiv.appendChild(attendanceCheckbox);

    studentListContainer.appendChild(studentDiv);
  });
}

const markAttendanceButton = document.getElementById("mark-attendance");

markAttendanceButton.onclick = async function () {
  const checkboxes = document.querySelectorAll(".attendance-checkbox");
  const date = new Date().toISOString().slice(0, 10);

  const attendanceData = Array.from(checkboxes).map((checkbox) => ({
    studentId: checkbox.dataset.studentId,
    present: checkbox.checked,
    date,
  }));

  try {
    const response = await fetch(`${baseURL}/teachers/markattendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attendanceData }),
    });

    if (response.ok) {
      alert("Attendance marked successfully");
    } else {
      alert("Failed to mark attendance");
      console.error("Error marking attendance:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

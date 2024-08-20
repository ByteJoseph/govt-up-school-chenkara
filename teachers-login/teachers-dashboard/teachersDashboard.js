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
  teacherNameView.textContent = globalVariables.teacherName; // Use textContent for safe text insertion

  document.getElementById("trname").textContent = globalVariables.teacherName;
  document.getElementById("trclass").textContent = globalVariables.teacherClass;
  document.getElementById("trNumber").textContent = globalVariables.teacherMobileNumber;
  document.getElementById("trcode").textContent = teacherID;
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

  const studentName = document.getElementById("studentName").value;
  const studentClass = globalVariables.teacherClass;
  const studentGender = document.querySelector(
    'input[name="gender"]:checked'
  ).value;
  const motherName = document.getElementById("motherName").value;
  const fatherName = document.getElementById("fatherName").value;
  const motherNumber = document.getElementById("motherPhone").value;
  const fatherNumber = document.getElementById("fatherPhone").value;

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
    const response = await fetch(
      `${baseURL}/teachers/createnewstudent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );

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
  const successPopupElement = document.getElementById(
    "student-profile-creation-success-popup"
  );
  const successMessageElement = document.getElementById(
    "student-profile-creation-success-message"
  );
  const okButtonElement = document.getElementById(
    "student-profile-creation-success-ok-button"
  );

  successMessageElement.textContent = `Profile for ${studentName} created successfully!`;

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

    const response = await fetch(
      `${baseURL}/teachers/fetchstudentsbyclass?studentClass=${studentClass}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const students = await response.json();
    containerElement.innerHTML = "";

    students.forEach((student) => {
      const studentDiv = document.createElement("div");
      studentDiv.className = "student-div";

      const nameElement = document.createElement("h3");
      nameElement.textContent = student.studentName; // Use textContent for safe text insertion

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
  const deletePopupElement = document.getElementById(
    "delete-confirmation-popup"
  );
  const deleteMessageElement = document.getElementById(
    "delete-confirmation-message"
  );
  const deleteButtonElement = document.getElementById(
    "delete-confirmation-delete-button"
  );
  const closeButtonElement = document.getElementById(
    "delete-confirmation-close-button"
  );

  deleteMessageElement.textContent = `Are you sure you want to delete ${studentName} from your students list?`;

  deletePopupElement.style.display = "flex";
  body.style.overflow = "hidden";

  closeButtonElement.onclick = function () {
    deletePopupElement.style.display = "none";
    body.style.overflow = "auto";
  };

  deleteButtonElement.onclick = async function () {
    try {
      const response = await fetch(
        `${baseURL}/teachers/deletestudent/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Student profile for ${studentName} deleted successfully`);
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

    const response = await fetch(
      `${baseURL}/teachers/fetchstudentsbyclass?studentClass=${classId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
  uniqueStudentList.forEach((student, index) => {
    const studentDiv = document.createElement("div");
    studentDiv.className = "unique-student-item";
    studentDiv.innerHTML = `
      <label>${sanitizeHtml(student.studentName)}</label>
      <input type="checkbox" name="student${index}-status" value="present">
    `;

    studentListContainer.appendChild(studentDiv);
  });
}

document
  .getElementById("unique-open-attendance-btn")
  .addEventListener("click", () => {
    fetchUniqueStudents();
    document.getElementById("unique-attendance-overlay").style.display = "flex";
    document.body.style.overflow = "hidden";
  });

document
  .getElementById("unique-close-attendance-icon")
  .addEventListener("click", () => {
    document.getElementById("unique-attendance-overlay").style.display = "none";
    document.body.style.overflow = "auto";
  });

document
  .getElementById("unique-submit-attendance-btn")
  .addEventListener("click", (event) => {
    event.preventDefault();

    const absentStudents = [];
    uniqueStudentList.forEach((student, index) => {
      const checkbox = document.querySelector(
        `input[name="student${index}-status"]`
      );
      if (!checkbox.checked) {
        absentStudents.push({
          _id: student._id,
          studentName: student.studentName,
        });
      }
    });

    document.getElementById("unique-attendance-overlay").style.display = "none";
    document.body.style.overflow = "auto";

    attendanceConfirmationPopup(absentStudents);
  });

function attendanceConfirmationPopup(absentStudents) {
  document.body.style.overflow = "hidden";

  document.getElementById("confirmation-popup-uniqueId123").style.display =
    "flex";
  const studentNames = absentStudents
    .map((student) => sanitizeHtml(student.studentName))
    .join(", ");
  document.getElementById("confirmation-popup-content-p").innerHTML =
    studentNames;

  document.getElementById("popup-yes-button-uniqueId123").onclick =
    function () {
      if (absentStudents.length > 0) {
        console.log("Absent Students:", absentStudents);
        sendAbsentStudentsToServer(absentStudents);
        sendAbsentStudentsToAttendanceRecordsServer(absentStudents);
        // WhatsApp messaging logic here
      } else {
        sendAbsentStudentsToAttendanceRecordsServer(absentStudents);
      }

      document.body.style.overflow = "auto";
      document.getElementById("confirmation-popup-uniqueId123").style.display =
        "none";
    };

  document.getElementById("popup-cancel-button-uniqueId123").onclick =
    function () {
      document.getElementById("confirmation-popup-uniqueId123").style.display =
        "none";
      document.body.style.overflow = "auto";
    };
}

document.querySelector(".popup-close-icon-uniqueId123").onclick = function () {
  document.getElementById("confirmation-popup-uniqueId123").style.display =
    "none";
  document.body.style.overflow = "auto";
};

async function sendAbsentStudentsToServer(absentStudents) {
  const requestBody = {
    date: new Date().toISOString().split("T")[0],
    absentStudents: absentStudents.map((student) => student._id),
  };

  try {
    const response = await fetch(`${baseURL}/teachers/markabsent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Absent students' data sent to server successfully");
    } else {
      console.error(
        "Failed to send absent students' data to server:",
        response.statusText
      );
      alert("Failed to mark absent students.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while marking absent students.");
  }
}

async function sendAbsentStudentsToAttendanceRecordsServer(absentStudents) {
  const requestBody = {
    date: new Date().toISOString(),
    absentStudents: absentStudents.map((student) => student.studentName),
    class: globalVariables.teacherClass,
  };

  try {
    const response = await fetch(
      `${baseURL}/attendanceRecords/markabsent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      console.log("Absent students' data sent to server successfully");
    } else {
      console.error(
        "Failed to send absent students' data to server:",
        response.statusText
      );
      alert("Failed to mark absent students.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while marking absent students.");
  }
}

document
  .getElementById("show-attendance-records-btn")
  .addEventListener("click", async () => {
    document.getElementById(
      "attendance-records-popup-dashboard"
    ).style.display = "grid";
    document.body.style.overflow = "hidden";

    try {
      const response = await fetch(
        `${baseURL}/attendanceRecords/getattendance?class=${globalVariables.teacherClass}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch attendance records");

      const records = await response.json();
      displayAttendanceRecords(records);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  });

document
  .getElementById("attendance-records-popup-close")
  .addEventListener("click", () => {
    document.getElementById(
      "attendance-records-popup-dashboard"
    ).style.display = "none";
    document.body.style.overflow = "auto";
  });

function displayAttendanceRecords(records) {
  const contentDiv = document.getElementById("attendance-records-content");
  contentDiv.innerHTML = "";

  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}/${month}/${year}`;
  }

  records.forEach((record) => {
    const formattedDate = formatDate(record.date);
    const recordDiv = document.createElement("div");
    recordDiv.className = "attendance-record-item";
    recordDiv.innerHTML = `
        <div class="attendance-record-content">
        <div class="attendance-record-date">${formattedDate}</div>
        <div class="attendance-record-students">${sanitizeHtml(record.absentStudents.join(", "))}</div>
        </div>
      `;
    contentDiv.appendChild(recordDiv);
  });
}

// Simple HTML sanitization function
function sanitizeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

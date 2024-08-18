const baseURL = 'https://govt-up-school-chenkara.onrender.com';
const urlParams = new URLSearchParams(window.location.search);
const studentID = urlParams.get("studentID");
const body = document.body;

if (studentID) {
  console.log(`Login noted with id "${studentID}"`);
  getStudentById(studentID);
  fetchAndDisplayAbsentDates(studentID);
  studentsAttendancePointsFn(studentID);

} else {
  body.style.display = "none";
  alert("Unregistered Login Detected!");
}

async function getStudentById(studentID) {
  try {
    const response = await fetch(`${baseURL}/students/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentID }),
    });

    if (!response.ok) {
      throw new Error("Teacher not found");
    }

    const studentData = await response.json();
    saveStudentData(studentData);
    displayStudentDetails();
    
  } catch (error) {
    console.error("Error fetching teacher:", error);
  }
}

const globalVariables = {
  studentName: null,
  studentClass: null,
  studentGender: null,
  motherName: null,
  fatherName: null,
  motherNumber: null,
  fatherNumber: null,
};

function saveStudentData(studentData) {
  globalVariables.studentName = studentData.studentName;
  globalVariables.studentClass = studentData.studentClass;
  globalVariables.studentGender = studentData.studentGender;
  globalVariables.motherName = studentData.motherName;
  globalVariables.fatherName = studentData.fatherName;
  globalVariables.motherNumber = studentData.motherNumber;
  globalVariables.fatherNumber = studentData.fatherNumber;
}

console.log({ globalVariables });

function displayStudentDetails(studentData) {
  function getFirstName(studentName) {
    const nameParts = studentName.split(" ");
    return nameParts[0];
  }

  const firstName = getFirstName(globalVariables.studentName);
  document.getElementById("student-name-header").innerText = firstName;

  const videoSource = document.getElementById("face1-video");
  const header = document.getElementById('header');

  if (globalVariables.studentGender === "female") {
    header.style.backgroundColor = "lightpink";
    videoSource.src = "/student-portal/student-dashboard/sd-resources/girlwaving.mp4";
  } else {
    videoSource.src = "/student-portal/student-dashboard/sd-resources/boywaving.mp4";
  }

  videoSource.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

  document.getElementById("student-name").innerText = globalVariables.studentName;
  document.getElementById("student-class").innerText = globalVariables.studentClass;
  document.getElementById("mother-name").innerText = globalVariables.motherName;
  document.getElementById("father-name").innerText = globalVariables.fatherName;
  document.getElementById("mother-number").innerText = globalVariables.motherNumber;
  document.getElementById("father-number").innerText = globalVariables.fatherNumber;

}

async function fetchAndDisplayAbsentDates(studentID) {
  try {
    const response = await fetch(`${baseURL}/students/absentdates/${studentID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch absent dates');
    }

    const absentDates = await response.json();
    displayAbsentDates(absentDates);
  } catch (error) {
    console.error('Error fetching absent dates:', error);
  }
}

function formatDateForDisplay(date) {
  const options ={ year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}


function displayAbsentDates(absentDates) {
  const absentDatesContainer = document.getElementById('absent-dates-container');
  absentDatesContainer.innerHTML = '';

  if (absentDates.length === 0) {
    absentDatesContainer.innerHTML = '<p>No absences recorded.</p>';
  } else {
    const list = document.createElement('ul');
    absentDates.forEach(date => {
      const listItem = document.createElement('li');
      listItem.textContent = formatDateForDisplay(date);
      list.appendChild(listItem);
    });
    absentDatesContainer.appendChild(list);
  }
}

async function studentsAttendancePointsFn(studentID) {
  try {
    const response = await fetch(`${baseURL}/students/points/${studentID}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch student info: ${response.statusText}`);
    }

    const studentData = await response.json();
    const attendancePoints = studentData.points;
    const noOfDaysAbsent = studentData.absentDates.length;

    document.getElementById("statistics-face-heading").innerText = `You have ${attendancePoints} out of 1000 points for attendance`;
    document.getElementById("daysAbsent").innerText = noOfDaysAbsent;
    document.getElementById("pointsReduced").innerText = 1000-(studentData.points);
    document.getElementById("pointsRemaining").innerText = studentData.points;

    console.log('Student Data:', studentData);
    
  } catch (error) {
    console.error('Error:', error);
  }
}
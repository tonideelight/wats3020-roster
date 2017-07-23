/* JS for WATS 3020 Roster Project */


//Create a Person class that accepts 'name' and 'email' - the constructor should create a 'username' that is created by cutting the email address before the '@' symbol.
class Person {
    constructor(name, email){
        this.name = name;
        this.email = email;
        this.username = email.split('@')[0];
    }
}


//Create a Student class that extends the Person class 
//Student class should be able to track a student's attendance
class Student extends Person {
    constructor(name, email){
    super(name, email);
    this.attendance = [];
} 
//Create a function that counts when a student is present or absent and return a percentage based on attendance
calculateAttendance(){
    if (this.attendance.length > 0){
        let counter = 0;
        for (let mark of this.attendance){
            counter = counter + mark;
        }
        let attendancePercentage = counter / this.attendance.length * 100;
        return `${attendancePercentage}%`;
    } else {
        return "0%";
    }
}
}


//extend the Person class to create a Teacher class that can also additionally accept an honorific title
class Teacher extends Person {
    constructor(name, email, honorific){
    super(name, email)
    this.honorific = honorific;
    }
}

// create a course class that accepts courseCode, courseTitle, courseDescription and 
// ensure it has the capability of adding a student, teacher, course code, course title and course description. 
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    
    addStudent(){
        let name = prompt('Student name');
        let email = prompt('Student email');
        let newStudent = new Student (name, email);
        this.students.push(newStudent);
        updateRoster(this);
    }

    setTeacher(){
        let name = prompt('Teacher name');
        let email = prompt('Teacher email');
        let honorific = prompt('Honorific title');
        this.teacher = new Teacher(name, email, honorific)
        updateRoster(this);
    }

    //mark the attendance of each student, push 1 for present and 0 for absent that is used in the calculateAttendance function   
    markAttendance(username, status='present'){
        let student = this.findStudent(username);
        if (status === 'present'){
            student.attendance.push(1);
        } else {
            student.attendance.push(0);
        }
        updateRoster(this)
    }
    
    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}

/////////////////////////////////////////
// Prompt User for Course Info  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
// Prompt the user for information to create the Course. In order to create a
// `Course` object, you must gather the following information:
//
// Prompt the user for the `courseCode` (the number/code of the course, like "WATS 3000").
let courseCode = prompt('Enter the course code (ex. WATS3020)');
// Prompt the user for the `courseTitle` (the name of the course, like "Introduction to JavaScript").
let courseTitle = prompt('Enter the name of the course');
//Prompt the user for the  `courseDescription` (the descriptive summary of the course).
let courseDescription = prompt('Enter the course description');
// Create a new `Course` object instance called `myCourse` using the three data points just collected from the user.
// Add in the values for the information supplied by the user above.
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}


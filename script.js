// =====================================================
// HOSPITAL MANAGEMENT SYSTEM
// COMPLETE FRONTEND JAVASCRIPT
// =====================================================


// =====================================================
// BACKEND URL
// =====================================================

const API_URL = "http://localhost:3000";


// =====================================================
// DATA ARRAYS
// =====================================================

let patients = [];

let doctors = [];

let appointments = [];

let adminLoggedIn = false;


// =====================================================
// EDIT MODAL VARIABLES
// =====================================================

let currentEditType = null;

let currentEditId = null;


// =====================================================
// HELPER FUNCTION
// =====================================================

function getElement(id) {

    return document.getElementById(id);

}


// =====================================================
// ADMIN AUTHENTICATION
// =====================================================


// -----------------------------------------------------
// SHOW LOGIN / SIGNUP FORM
// -----------------------------------------------------

function showAuthForm(formName) {

    const loginForm =
        getElement("loginForm");

    const signupForm =
        getElement("signupForm");

    const loginButton =
        getElement("showLoginBtn");

    const signupButton =
        getElement("showSignupBtn");


    if (formName === "signup") {

        if (loginForm) {
            loginForm.style.display = "none";
        }

        if (signupForm) {
            signupForm.style.display = "block";
        }

        if (loginButton) {
            loginButton.classList.remove("active");
        }

        if (signupButton) {
            signupButton.classList.add("active");
        }

    }

    else {

        if (loginForm) {
            loginForm.style.display = "block";
        }

        if (signupForm) {
            signupForm.style.display = "none";
        }

        if (signupButton) {
            signupButton.classList.remove("active");
        }

        if (loginButton) {
            loginButton.classList.add("active");
        }

    }

}


window.showAuthForm = showAuthForm;


// -----------------------------------------------------
// SHOW ADMIN PORTAL
// -----------------------------------------------------

function showAdminPortal() {

    const adminAuth =
        getElement("adminAuth");

    const nav =
        document.querySelector("nav");

    const main =
        document.querySelector("main");


    if (adminAuth) {
        adminAuth.style.display = "flex";
    }

    if (nav) {
        nav.style.display = "none";
    }

    if (main) {
        main.style.display = "none";
    }

}


// -----------------------------------------------------
// SHOW HOSPITAL SYSTEM
// -----------------------------------------------------

function showHospitalSystem() {

    const adminAuth =
        getElement("adminAuth");

    const nav =
        document.querySelector("nav");

    const main =
        document.querySelector("main");


    if (adminAuth) {
        adminAuth.style.display = "none";
    }

    if (nav) {
        nav.style.display = "block";
    }

    if (main) {
        main.style.display = "block";
    }

}


// -----------------------------------------------------
// ADMIN SIGN UP
// -----------------------------------------------------

const signupForm =
    getElement("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                getElement(
                    "signupUsername"
                ).value.trim();


            const phoneElement =
                getElement(
                    "signupPhone"
                );


            const emailElement =
                getElement(
                    "signupEmail"
                );


            const password =
                getElement(
                    "signupPassword"
                ).value;


            const confirmPassword =
                getElement(
                    "signupConfirmPassword"
                ).value;


            const phone =
                phoneElement
                    ? phoneElement.value.trim()
                    : "";


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            // Check username

            if (!username) {

                alert(
                    "Please enter a username."
                );

                return;

            }


            // Check phone

            if (!phone) {

                alert(
                    "Please enter a phone number."
                );

                return;

            }


            // Check email

            if (!email) {

                alert(
                    "Please enter an email address."
                );

                return;

            }


            // Check password

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // Minimum password length

            if (password.length < 4) {

                alert(
                    "Password must contain at least 4 characters."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/admin/signup",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    phone:
                                        phone,

                                    email:
                                        email,

                                    password:
                                        password

                                })

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Could not create admin account."
                    );

                    return;

                }


                alert(
                    "Admin account created successfully. Please sign in."
                );


                signupForm.reset();


                showAuthForm(
                    "login"
                );

            }

            catch (error) {

                console.error(error);


                alert(
                    "Cannot connect to backend.\n" +
                    "Make sure server.js is running."
                );

            }

        }
    );

}


// -----------------------------------------------------
// ADMIN LOGIN
// -----------------------------------------------------

const loginForm =
    getElement("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                getElement(
                    "loginUsername"
                ).value.trim();


            const password =
                getElement(
                    "loginPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/admin/login",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    password:
                                        password

                                })

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Invalid username or password."
                    );

                    return;

                }


                adminLoggedIn = true;


                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                loginForm.reset();


                showHospitalSystem();


                await loadData();

            }

            catch (error) {

                console.error(error);


                alert(
                    "Cannot connect to backend.\n" +
                    "Make sure server.js is running."
                );

            }

        }
    );

}


// -----------------------------------------------------
// ADMIN LOGOUT
// -----------------------------------------------------

function adminLogout() {

    adminLoggedIn = false;


    sessionStorage.removeItem(
        "adminLoggedIn"
    );


    showAdminPortal();


    showAuthForm(
        "login"
    );


    alert(
        "You have been logged out."
    );

}


window.adminLogout =
    adminLogout;


// -----------------------------------------------------
// CHECK ADMIN LOGIN
// -----------------------------------------------------

function checkAdminLogin() {

    const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn === "true") {

        adminLoggedIn = true;


        showHospitalSystem();


        loadData();

    }

    else {

        adminLoggedIn = false;


        showAdminPortal();


        showAuthForm(
            "login"
        );

    }

}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageName) {

    const sections =
        document.querySelectorAll(
            "main section"
        );


    sections.forEach(
        function(section) {

            section.style.display =
                "none";

        }
    );


    const selectedPage =
        getElement(pageName);


    if (selectedPage) {

        selectedPage.style.display =
            "block";

    }

}


window.showPage =
    showPage;


// =====================================================
// LOAD ALL DATA
// =====================================================

async function loadData() {

    await loadPatients();

    await loadDoctors();

    await loadAppointments();


    showPage(
        "dashboard"
    );

}


// =====================================================
// PATIENT MANAGEMENT
// =====================================================


// -----------------------------------------------------
// LOAD PATIENTS
// -----------------------------------------------------

async function loadPatients() {

    try {

        const response =
            await fetch(
                API_URL +
                "/patients"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load patients."
            );

        }


        patients =
            await response.json();


        displayPatients();


        updatePatientDropdown();


        updateDashboard();

    }

    catch (error) {

        console.error(error);


        alert(
            "Cannot connect to backend.\n" +
            "Make sure server.js is running."
        );

    }

}


// -----------------------------------------------------
// ADD PATIENT
// -----------------------------------------------------

const patientForm =
    getElement("patientForm");


if (patientForm) {

    patientForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                getElement(
                    "patientName"
                ).value.trim();


            const age =
                getElement(
                    "patientAge"
                ).value;


            const disease =
                getElement(
                    "patientDisease"
                ).value.trim();


            const bloodGroup =
                getElement(
                    "patientBloodGroup"
                ).value;


            const gender =
                getElement(
                    "patientGender"
                ).value;


            const phone =
                getElement(
                    "patientPhone"
                ).value.trim();


            // Check duplicate patient

            const patientExists =
                patients.some(
                    function(patient) {

                        return (
                            patient.name
                                .toLowerCase() ===
                            name.toLowerCase()
                        );

                    }
                );


            if (patientExists) {

                alert(
                    "This patient is already registered."
                );

                return;

            }


            const patient = {

                name:
                    name,

                age:
                    age,

                disease:
                    disease,

                bloodGroup:
                    bloodGroup,

                gender:
                    gender,

                phone:
                    phone

            };


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/patients",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    patient
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Could not add patient."
                    );

                    return;

                }


                alert(
                    "Patient added successfully!"
                );


                patientForm.reset();


                await loadPatients();

            }

            catch (error) {

                console.error(error);


                alert(
                    "Cannot connect to backend."
                );

            }

        }
    );

}


// -----------------------------------------------------
// DISPLAY PATIENTS
// -----------------------------------------------------

function displayPatients() {

    const patientList =
        getElement(
            "patientList"
        );


    if (!patientList) {
        return;
    }


    patientList.innerHTML = "";


    patients.forEach(
        function(patient, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <i class="fa-solid fa-user"></i>
                    ${patient.name || ""}
                </td>

                <td>
                    ${patient.age || ""}
                </td>

                <td>
                    ${patient.bloodGroup || ""}
                </td>

                <td>
                    ${patient.gender || ""}
                </td>

                <td>
                    ${patient.phone || ""}
                </td>

                <td>
                    ${patient.disease || ""}
                </td>

                <td>

                    <button
                        class="action-button edit-button"
                        onclick="editPatient(${patient.id})"
                    >

                        <i class="fa-solid fa-pen"></i>
                        Edit

                    </button>


                    <button
                        class="action-button delete-button"
                        onclick="deletePatient(${patient.id})"
                    >

                        <i class="fa-solid fa-trash"></i>
                        Delete

                    </button>

                </td>

            `;


            patientList.appendChild(
                row
            );

        }
    );


    const patientCount =
        getElement(
            "patientCount"
        );


    if (patientCount) {

        patientCount.innerText =
            patients.length;

    }

}


// =====================================================
// EDIT PATIENT
// ALL FIELDS TOGETHER
// =====================================================

async function editPatient(id) {

    const patient =
        patients.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!patient) {

        alert(
            "Patient not found."
        );

        return;

    }


    currentEditType =
        "patient";


    currentEditId =
        id;


    const modalTitle =
        getElement(
            "editModalTitle"
        );


    if (modalTitle) {

        modalTitle.innerText =
            "Edit Patient";

    }


    const editFields =
        getElement(
            "editFormFields"
        );


    editFields.innerHTML = `

        <div class="edit-form-group">

            <label>
                Patient Name
            </label>

            <input
                type="text"
                id="editPatientName"
                value="${patient.name || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Age
            </label>

            <input
                type="number"
                id="editPatientAge"
                value="${patient.age || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Blood Group
            </label>

            <select
                id="editPatientBloodGroup"
                required
            >

                <option value="">
                    Select Blood Group
                </option>

                <option
                    value="A+"
                    ${patient.bloodGroup === "A+" ? "selected" : ""}
                >
                    A+
                </option>

                <option
                    value="A-"
                    ${patient.bloodGroup === "A-" ? "selected" : ""}
                >
                    A-
                </option>

                <option
                    value="B+"
                    ${patient.bloodGroup === "B+" ? "selected" : ""}
                >
                    B+
                </option>

                <option
                    value="B-"
                    ${patient.bloodGroup === "B-" ? "selected" : ""}
                >
                    B-
                </option>

                <option
                    value="AB+"
                    ${patient.bloodGroup === "AB+" ? "selected" : ""}
                >
                    AB+
                </option>

                <option
                    value="AB-"
                    ${patient.bloodGroup === "AB-" ? "selected" : ""}
                >
                    AB-
                </option>

                <option
                    value="O+"
                    ${patient.bloodGroup === "O+" ? "selected" : ""}
                >
                    O+
                </option>

                <option
                    value="O-"
                    ${patient.bloodGroup === "O-" ? "selected" : ""}
                >
                    O-
                </option>

            </select>

        </div>


        <div class="edit-form-group">

            <label>
                Gender
            </label>

            <select
                id="editPatientGender"
                required
            >

                <option value="">
                    Select Gender
                </option>

                <option
                    value="Male"
                    ${patient.gender === "Male" ? "selected" : ""}
                >
                    Male
                </option>

                <option
                    value="Female"
                    ${patient.gender === "Female" ? "selected" : ""}
                >
                    Female
                </option>

                <option
                    value="Other"
                    ${patient.gender === "Other" ? "selected" : ""}
                >
                    Other
                </option>

            </select>

        </div>


        <div class="edit-form-group">

            <label>
                Phone Number
            </label>

            <input
                type="tel"
                id="editPatientPhone"
                value="${patient.phone || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Disease
            </label>

            <input
                type="text"
                id="editPatientDisease"
                value="${patient.disease || ""}"
                required
            >

        </div>

    `;


    getElement(
        "editModal"
    ).classList.add(
        "active"
    );

}


window.editPatient =
    editPatient;


// =====================================================
// DELETE PATIENT
// =====================================================

async function deletePatient(id) {

    const hasAppointment =
        appointments.some(
            function(appointment) {

                return (
                    appointment.patientId === id &&
                    appointment.status === "scheduled"
                );

            }
        );


    if (hasAppointment) {

        alert(
            "This patient cannot be deleted because " +
            "there is an active appointment."
        );

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this patient?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/patients/" +
                id,
                {

                    method:
                        "DELETE"

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not delete patient."
            );

            return;

        }


        await loadPatients();


        alert(
            "Patient deleted successfully."
        );

    }

    catch (error) {

        console.error(error);


        alert(
            "Could not connect to backend."
        );

    }

}


window.deletePatient =
    deletePatient;


// =====================================================
// PATIENT DROPDOWN
// =====================================================

function updatePatientDropdown() {

    const dropdown =
        getElement(
            "appointmentPatient"
        );


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Select a patient
        </option>

    `;


    patients.forEach(
        function(patient) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                patient.id;


            option.textContent =
                patient.name +
                " - Age " +
                patient.age;


            dropdown.appendChild(
                option
            );

        }
    );

}


// =====================================================
// DOCTOR MANAGEMENT
// =====================================================


// -----------------------------------------------------
// LOAD DOCTORS
// -----------------------------------------------------

async function loadDoctors() {

    try {

        const response =
            await fetch(
                API_URL +
                "/doctors"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load doctors."
            );

        }


        doctors =
            await response.json();


        displayDoctors();


        updateDoctorDropdown();


        displayAvailableDoctors();


        updateDashboard();

    }

    catch (error) {

        console.error(error);


        alert(
            "Cannot connect to backend."
        );

    }

}


// -----------------------------------------------------
// ADD DOCTOR
// -----------------------------------------------------

const doctorForm =
    getElement("doctorForm");


if (doctorForm) {

    doctorForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                getElement(
                    "doctorName"
                ).value.trim();


            const gender =
                getElement(
                    "doctorGender"
                ).value;


            const phone =
                getElement(
                    "doctorPhone"
                ).value.trim();


            const email =
                getElement(
                    "doctorEmail"
                ).value.trim();


            const specialization =
                getElement(
                    "doctorSpecialization"
                ).value.trim();


            const experience =
                getElement(
                    "doctorExperience"
                ).value;


            const address =
                getElement(
                    "doctorAddress"
                ).value.trim();


            const fee =
                getElement(
                    "doctorFee"
                ).value;


            // Check duplicate doctor

            const doctorExists =
                doctors.some(
                    function(doctor) {

                        return (
                            doctor.name
                                .toLowerCase() ===
                            name.toLowerCase()
                        );

                    }
                );


            if (doctorExists) {

                alert(
                    "This doctor is already registered."
                );

                return;

            }


            const doctor = {

                name:
                    name,

                gender:
                    gender,

                phone:
                    phone,

                email:
                    email,

                specialization:
                    specialization,

                experience:
                    experience,

                address:
                    address,

                fee:
                    fee

            };


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/doctors",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    doctor
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Could not add doctor."
                    );

                    return;

                }


                alert(
                    "Doctor added successfully!"
                );


                doctorForm.reset();


                await loadDoctors();

            }

            catch (error) {

                console.error(error);


                alert(
                    "Cannot connect to backend."
                );

            }

        }
    );

}


// -----------------------------------------------------
// DISPLAY DOCTORS
// -----------------------------------------------------

function displayDoctors() {

    const doctorList =
        getElement(
            "doctorList"
        );


    if (!doctorList) {
        return;
    }


    doctorList.innerHTML = "";


    doctors.forEach(
        function(doctor, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <i class="fa-solid fa-user-doctor"></i>

                    Dr. ${doctor.name || ""}

                </td>

                <td>
                    ${doctor.gender || ""}
                </td>

                <td>
                    ${doctor.phone || ""}
                </td>

                <td>
                    ${doctor.email || ""}
                </td>

                <td>
                    ${doctor.specialization || ""}
                </td>

                <td>
                    ${doctor.experience || ""}
                </td>

                <td>
                    ${doctor.address || ""}
                </td>

                <td>
                    ₹${doctor.fee || 0}
                </td>

                <td>

                    <button
                        class="action-button edit-button"
                        onclick="editDoctor(${doctor.id})"
                    >

                        <i class="fa-solid fa-pen"></i>

                        Edit

                    </button>


                    <button
                        class="action-button delete-button"
                        onclick="deleteDoctor(${doctor.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </td>

            `;


            doctorList.appendChild(
                row
            );

        }
    );


    const doctorCount =
        getElement(
            "doctorCount"
        );


    if (doctorCount) {

        doctorCount.innerText =
            doctors.length;

    }

}


// =====================================================
// EDIT DOCTOR
// ALL FIELDS TOGETHER
// =====================================================

async function editDoctor(id) {

    const doctor =
        doctors.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!doctor) {

        alert(
            "Doctor not found."
        );

        return;

    }


    currentEditType =
        "doctor";


    currentEditId =
        id;


    getElement(
        "editModalTitle"
    ).innerText =
        "Edit Doctor";


    getElement(
        "editFormFields"
    ).innerHTML = `

        <div class="edit-form-group">

            <label>
                Doctor Name
            </label>

            <input
                type="text"
                id="editDoctorName"
                value="${doctor.name || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Gender
            </label>

            <select
                id="editDoctorGender"
                required
            >

                <option value="">
                    Select Gender
                </option>

                <option
                    value="Male"
                    ${doctor.gender === "Male" ? "selected" : ""}
                >
                    Male
                </option>

                <option
                    value="Female"
                    ${doctor.gender === "Female" ? "selected" : ""}
                >
                    Female
                </option>

                <option
                    value="Other"
                    ${doctor.gender === "Other" ? "selected" : ""}
                >
                    Other
                </option>

            </select>

        </div>


        <div class="edit-form-group">

            <label>
                Phone Number
            </label>

            <input
                type="tel"
                id="editDoctorPhone"
                value="${doctor.phone || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Email
            </label>

            <input
                type="email"
                id="editDoctorEmail"
                value="${doctor.email || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Specialization
            </label>

            <input
                type="text"
                id="editDoctorSpecialization"
                value="${doctor.specialization || ""}"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Experience in Years
            </label>

            <input
                type="number"
                id="editDoctorExperience"
                value="${doctor.experience || ""}"
                min="0"
                required
            >

        </div>


        <div class="edit-form-group">

            <label>
                Address
            </label>

            <textarea
                id="editDoctorAddress"
                required
            >${doctor.address || ""}</textarea>

        </div>


        <div class="edit-form-group">

            <label>
                Consultation Fee
            </label>

            <input
                type="number"
                id="editDoctorFee"
                value="${doctor.fee || ""}"
                min="0"
                required
            >

        </div>

    `;


    getElement(
        "editModal"
    ).classList.add(
        "active"
    );

}


window.editDoctor =
    editDoctor;


// =====================================================
// DELETE DOCTOR
// =====================================================

async function deleteDoctor(id) {

    const hasAppointment =
        appointments.some(
            function(appointment) {

                return (
                    appointment.doctorId === id &&
                    appointment.status === "scheduled"
                );

            }
        );


    if (hasAppointment) {

        alert(
            "This doctor cannot be deleted because " +
            "there is an active appointment."
        );

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this doctor?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/doctors/" +
                id,
                {

                    method:
                        "DELETE"

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not delete doctor."
            );

            return;

        }


        await loadDoctors();


        alert(
            "Doctor deleted successfully."
        );

    }

    catch (error) {

        console.error(error);


        alert(
            "Could not connect to backend."
        );

    }

}


window.deleteDoctor =
    deleteDoctor;


// =====================================================
// AVAILABLE DOCTORS TABLE
// =====================================================

function displayAvailableDoctors() {

    const doctorList =
        getElement(
            "appointmentDoctorList"
        );


    if (!doctorList) {
        return;
    }


    doctorList.innerHTML = "";


    doctors.forEach(
        function(doctor) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <i class="fa-solid fa-user-doctor"></i>

                    Dr. ${doctor.name || ""}

                </td>

                <td>
                    ${doctor.specialization || ""}
                </td>

                <td>
                    ₹${doctor.fee || 0}
                </td>

            `;


            doctorList.appendChild(
                row
            );

        }
    );

}


// =====================================================
// DOCTOR DROPDOWN
// =====================================================

function updateDoctorDropdown() {

    const dropdown =
        getElement(
            "appointmentDoctor"
        );


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Select a doctor
        </option>

    `;


    doctors.forEach(
        function(doctor) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                doctor.id;


            option.textContent =
                "Dr. " +
                doctor.name +
                " - " +
                doctor.specialization +
                " - ₹" +
                doctor.fee;


            dropdown.appendChild(
                option
            );

        }
    );

}


// =====================================================
// SHOW SELECTED DOCTOR FEE
// =====================================================

const appointmentDoctor =
    getElement(
        "appointmentDoctor"
    );


if (appointmentDoctor) {

    appointmentDoctor.addEventListener(
        "change",
        function() {

            const doctorId =
                Number(
                    this.value
                );


            const feeDisplay =
                getElement(
                    "selectedDoctorFee"
                );


            if (!feeDisplay) {
                return;
            }


            if (!doctorId) {

                feeDisplay.innerText =
                    "₹0";

                return;

            }


            const doctor =
                doctors.find(
                    function(item) {

                        return (
                            item.id ===
                            doctorId
                        );

                    }
                );


            if (doctor) {

                feeDisplay.innerText =
                    "₹" +
                    doctor.fee;

            }

            else {

                feeDisplay.innerText =
                    "₹0";

            }

        }
    );

}


// =====================================================
// APPOINTMENT MANAGEMENT
// =====================================================


// -----------------------------------------------------
// LOAD APPOINTMENTS
// -----------------------------------------------------

async function loadAppointments() {

    try {

        const response =
            await fetch(
                API_URL +
                "/appointments"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load appointments."
            );

        }


        appointments =
            await response.json();


        appointments.forEach(
            function(appointment) {

                if (!appointment.status) {

                    appointment.status =
                        "scheduled";

                }

            }
        );


        displayAppointments();


        displayHistory();


        updateDashboard();

    }

    catch (error) {

        console.error(error);


        alert(
            "Cannot connect to backend."
        );

    }

}


// -----------------------------------------------------
// BOOK APPOINTMENT
// -----------------------------------------------------

const appointmentForm =
    getElement(
        "appointmentForm"
    );


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const patientId =
                Number(
                    getElement(
                        "appointmentPatient"
                    ).value
                );


            const doctorId =
                Number(
                    getElement(
                        "appointmentDoctor"
                    ).value
                );


            const date =
                getElement(
                    "appointmentDate"
                ).value;


            const patient =
                patients.find(
                    function(item) {

                        return (
                            item.id ===
                            patientId
                        );

                    }
                );


            if (!patient) {

                alert(
                    "Please select a registered patient."
                );

                return;

            }


            const doctor =
                doctors.find(
                    function(item) {

                        return (
                            item.id ===
                            doctorId
                        );

                    }
                );


            if (!doctor) {

                alert(
                    "Please select a registered doctor."
                );

                return;

            }


            const appointment = {

                patientId:
                    patientId,

                doctorId:
                    doctorId,

                date:
                    date

            };


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/appointments",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    appointment
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Could not book appointment."
                    );

                    return;

                }


                alert(
                    "Appointment booked successfully!"
                );


                appointmentForm.reset();


                const feeDisplay =
                    getElement(
                        "selectedDoctorFee"
                    );


                if (feeDisplay) {

                    feeDisplay.innerText =
                        "₹0";

                }


                await loadAppointments();

            }

            catch (error) {

                console.error(error);


                alert(
                    "Cannot connect to backend."
                );

            }

        }
    );

}


// =====================================================
// DISPLAY CURRENT APPOINTMENTS
// =====================================================

function displayAppointments() {

    const appointmentList =
        getElement(
            "appointmentList"
        );


    if (!appointmentList) {
        return;
    }


    appointmentList.innerHTML = "";


    const activeAppointments =
        appointments.filter(
            function(appointment) {

                return (
                    appointment.status ===
                    "scheduled"
                );

            }
        );


    activeAppointments.forEach(
        function(appointment, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <i class="fa-solid fa-user"></i>

                    ${
                        appointment.patientName ||
                        appointment.patient ||
                        ""
                    }

                </td>

                <td>

                    <i class="fa-solid fa-user-doctor"></i>

                    Dr.
                    ${
                        appointment.doctorName ||
                        appointment.doctor ||
                        ""
                    }

                </td>

                <td>
                    ${appointment.specialization || ""}
                </td>

                <td>
                    ₹${appointment.fee || 0}
                </td>

                <td>
                    ${appointment.date || ""}
                </td>

                <td>

                    <span
                        class="status status-scheduled"
                    >
                        Scheduled
                    </span>

                </td>

                <td>

                    <button
                        class="action-button complete-button"
                        onclick="completeAppointment(${appointment.id})"
                    >

                        <i class="fa-solid fa-check"></i>

                        Complete

                    </button>


                    <button
                        class="action-button cancel-button"
                        onclick="cancelAppointment(${appointment.id})"
                    >

                        <i class="fa-solid fa-xmark"></i>

                        Cancel

                    </button>

                </td>

            `;


            appointmentList.appendChild(
                row
            );

        }
    );

}


// =====================================================
// COMPLETE APPOINTMENT
// =====================================================

async function completeAppointment(id) {

    if (
        !confirm(
            "Mark this appointment as completed?"
        )
    ) {

        return;

    }


    await updateAppointmentStatus(
        id,
        "completed"
    );

}


window.completeAppointment =
    completeAppointment;


// =====================================================
// CANCEL APPOINTMENT
// =====================================================

async function cancelAppointment(id) {

    if (
        !confirm(
            "Cancel this appointment?"
        )
    ) {

        return;

    }


    await updateAppointmentStatus(
        id,
        "cancelled"
    );

}


window.cancelAppointment =
    cancelAppointment;


// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

async function updateAppointmentStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/appointments/" +
                id,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            status:
                                status

                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not update appointment."
            );

            return;

        }


        await loadAppointments();


        if (status === "completed") {

            alert(
                "Appointment marked as completed."
            );

        }

        else {

            alert(
                "Appointment cancelled."
            );

        }

    }

    catch (error) {

        console.error(error);


        alert(
            "Could not connect to backend."
        );

    }

}


// =====================================================
// APPOINTMENT HISTORY
// =====================================================

function displayHistory() {

    const historyList =
        getElement(
            "historyList"
        );


    if (!historyList) {
        return;
    }


    historyList.innerHTML = "";


    const history =
        appointments.filter(
            function(appointment) {

                return (

                    appointment.status ===
                    "completed"

                    ||

                    appointment.status ===
                    "cancelled"

                );

            }
        );


    history.forEach(
        function(appointment, index) {

            const statusClass =
                appointment.status ===
                "completed"

                    ? "status-completed"

                    : "status-cancelled";


            const statusText =
                appointment.status ===
                "completed"

                    ? "Completed"

                    : "Cancelled";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <i class="fa-solid fa-user"></i>

                    ${
                        appointment.patientName ||
                        appointment.patient ||
                        ""
                    }

                </td>

                <td>

                    <i class="fa-solid fa-user-doctor"></i>

                    Dr.
                    ${
                        appointment.doctorName ||
                        appointment.doctor ||
                        ""
                    }

                </td>

                <td>
                    ${appointment.specialization || ""}
                </td>

                <td>
                    ₹${appointment.fee || 0}
                </td>

                <td>
                    ${appointment.date || ""}
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${statusText}

                    </span>

                </td>

            `;


            historyList.appendChild(
                row
            );

        }
    );

}


// =====================================================
// EDIT MODAL
// =====================================================


// -----------------------------------------------------
// CLOSE EDIT MODAL
// -----------------------------------------------------

function closeEditModal() {

    const modal =
        getElement(
            "editModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    currentEditType =
        null;


    currentEditId =
        null;

}


window.closeEditModal =
    closeEditModal;


// -----------------------------------------------------
// SAVE EDITED PATIENT / DOCTOR
// -----------------------------------------------------

const editForm =
    getElement(
        "editForm"
    );


if (editForm) {

    editForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // =========================================
            // SAVE PATIENT
            // =========================================

            if (
                currentEditType ===
                "patient"
            ) {

                const updatedPatient = {

                    name:
                        getElement(
                            "editPatientName"
                        ).value.trim(),

                    age:
                        getElement(
                            "editPatientAge"
                        ).value,

                    bloodGroup:
                        getElement(
                            "editPatientBloodGroup"
                        ).value,

                    gender:
                        getElement(
                            "editPatientGender"
                        ).value,

                    phone:
                        getElement(
                            "editPatientPhone"
                        ).value.trim(),

                    disease:
                        getElement(
                            "editPatientDisease"
                        ).value.trim()

                };


                try {

                    const response =
                        await fetch(
                            API_URL +
                            "/patients/" +
                            currentEditId,
                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        updatedPatient
                                    )

                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            result.message ||
                            "Could not update patient."
                        );

                        return;

                    }


                    alert(
                        "Patient updated successfully!"
                    );


                    closeEditModal();


                    await loadPatients();

                }

                catch (error) {

                    console.error(error);


                    alert(
                        "Could not connect to backend."
                    );

                }

            }


            // =========================================
            // SAVE DOCTOR
            // =========================================

            else if (
                currentEditType ===
                "doctor"
            ) {

                const updatedDoctor = {

                    name:
                        getElement(
                            "editDoctorName"
                        ).value.trim(),

                    gender:
                        getElement(
                            "editDoctorGender"
                        ).value,

                    phone:
                        getElement(
                            "editDoctorPhone"
                        ).value.trim(),

                    email:
                        getElement(
                            "editDoctorEmail"
                        ).value.trim(),

                    specialization:
                        getElement(
                            "editDoctorSpecialization"
                        ).value.trim(),

                    experience:
                        getElement(
                            "editDoctorExperience"
                        ).value,

                    address:
                        getElement(
                            "editDoctorAddress"
                        ).value.trim(),

                    fee:
                        getElement(
                            "editDoctorFee"
                        ).value

                };


                try {

                    const response =
                        await fetch(
                            API_URL +
                            "/doctors/" +
                            currentEditId,
                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        updatedDoctor
                                    )

                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            result.message ||
                            "Could not update doctor."
                        );

                        return;

                    }


                    alert(
                        "Doctor updated successfully!"
                    );


                    closeEditModal();


                    await loadDoctors();

                }

                catch (error) {

                    console.error(error);


                    alert(
                        "Could not connect to backend."
                    );

                }

            }

        }
    );

}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard(){
    const patientCount =
        getElement(
            "patientCount"
        );
    const doctorCount =
        getElement(
            "doctorCount"
        );
    const appointmentCount =
        getElement(
            "appointmentCount"
        );

    const completedCount =
        getElement(
            "completedCount"
        );
    if (patientCount) {
        patientCount.innerText =
            patients.length;
    }

    if (doctorCount) {
        doctorCount.innerText =
            doctors.length;
    }
    if (appointmentCount) {
        appointmentCount.innerText =
            appointments.filter(
                function(appointment) {
                   return (
                        appointment.status ===
                        "scheduled"
                    );
                }
            ).length;
    }
    if (completedCount) {
        completedCount.innerText =
            appointments.filter(
                function(appointment) {

                    return (
                        appointment.status ===
                        "completed"
                    );
                }
            ).length;
    }
}
// =====================================================
// START APPLICATION
// =====================================================

checkAdminLogin();
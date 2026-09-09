// =================================================
// HOSPITAL MANAGEMENT SYSTEM - SERVER
// =================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


// =================================================
// SERVER SETTINGS
// =================================================

const PORT = 3000;


// =================================================
// JSON FILE PATHS
// =================================================

const patientsFile =
    path.join(__dirname, "patients.json");

const doctorsFile =
    path.join(__dirname, "doctors.json");

const appointmentsFile =
    path.join(__dirname, "appointments.json");

const adminsFile =
    path.join(__dirname, "admins.json");


// =================================================
// HELPER FUNCTIONS
// =================================================


// Read data from JSON file

function readData(file) {

    try {

        if (!fs.existsSync(file)) {

            fs.writeFileSync(
                file,
                "[]"
            );

        }

        const data =
            fs.readFileSync(
                file,
                "utf8"
            );

        if (!data.trim()) {

            return [];

        }

        return JSON.parse(data);

    }

    catch (error) {

        console.log(
            "Error reading file:",
            error
        );

        return [];

    }

}


// Save data to JSON file

function saveData(file, data) {

    fs.writeFileSync(

        file,

        JSON.stringify(
            data,
            null,
            2
        )

    );

}


// Send JSON response

function sendResponse(
    response,
    statusCode,
    data
) {

    response.writeHead(
        statusCode,
        {

            "Content-Type":
                "application/json",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, DELETE, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"

        }
    );

    response.end(
        JSON.stringify(data)
    );

}


// Get request body

function getRequestBody(request) {

    return new Promise(
        function(resolve, reject) {

            let body = "";

            request.on(
                "data",
                function(chunk) {

                    body +=
                        chunk.toString();

                }
            );

            request.on(
                "end",
                function() {

                    try {

                        if (!body) {

                            resolve({});

                        }

                        else {

                            resolve(
                                JSON.parse(body)
                            );

                        }

                    }

                    catch (error) {

                        reject(error);

                    }

                }
            );

            request.on(
                "error",
                function(error) {

                    reject(error);

                }
            );

        }
    );

}


// Hash password

function hashPassword(password) {

    return crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

}


// =================================================
// CREATE SERVER
// =================================================

const server =
    http.createServer(

        async function(
            request,
            response
        ) {


// =================================================
// HANDLE CORS
// =================================================

if (
    request.method ===
    "OPTIONS"
) {

    response.writeHead(
        204,
        {

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, DELETE, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"

        }
    );

    response.end();

    return;

}


// =================================================
// ADMIN SIGNUP
// =================================================

if (
    request.method === "POST" &&
    request.url === "/admin/signup"
) {

    try {

        const body =
            await getRequestBody(
                request
            );


        const username =
            String(
                body.username || ""
            ).trim();


        const phone =
            String(
                body.phone || ""
            ).trim();


        const email =
            String(
                body.email || ""
            ).trim();


        const password =
            body.password || "";


        if (!username) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Username is required"
                }
            );

            return;

        }


        if (!phone) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Phone number is required"
                }
            );

            return;

        }


        if (!email) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Email is required"
                }
            );

            return;

        }


        if (
            password.length < 4
        ) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Password must be at least 4 characters"
                }
            );

            return;

        }


        const admins =
            readData(
                adminsFile
            );


        const existingUsername =
            admins.find(
                function(admin) {

                    return (
                        admin.username &&
                        admin.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                }
            );


        if (existingUsername) {

            sendResponse(
                response,
                409,
                {
                    message:
                        "Username already exists"
                }
            );

            return;

        }


        const existingEmail =
            admins.find(
                function(admin) {

                    return (
                        admin.email &&
                        admin.email.toLowerCase() ===
                        email.toLowerCase()
                    );

                }
            );


        if (existingEmail) {

            sendResponse(
                response,
                409,
                {
                    message:
                        "Email already exists"
                }
            );

            return;

        }


        const newAdmin = {

            id:
                Date.now(),

            username:
                username,

            phone:
                phone,

            email:
                email,

            password:
                hashPassword(password)

        };


        admins.push(
            newAdmin
        );


        saveData(
            adminsFile,
            admins
        );


        sendResponse(
            response,
            201,
            {
                message:
                    "Admin account created successfully"
            }
        );


        return;

    }

    catch (error) {

        console.log(
            "Signup error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// ADMIN LOGIN
// =================================================

if (
    request.method === "POST" &&
    request.url === "/admin/login"
) {

    try {

        const body =
            await getRequestBody(
                request
            );


        const username =
            String(
                body.username || ""
            ).trim();


        const password =
            body.password || "";


        const admins =
            readData(
                adminsFile
            );


        const admin =
            admins.find(
                function(item) {

                    return (
                        item.username &&
                        item.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                }
            );


        if (!admin) {

            sendResponse(
                response,
                401,
                {
                    message:
                        "Invalid username or password"
                }
            );

            return;

        }


        const hashedPassword =
            hashPassword(password);


        if (
            admin.password !==
            hashedPassword
        ) {

            sendResponse(
                response,
                401,
                {
                    message:
                        "Invalid username or password"
                }
            );

            return;

        }


        sendResponse(
            response,
            200,
            {

                message:
                    "Login successful",

                id:
                    admin.id,

                username:
                    admin.username,

                phone:
                    admin.phone || "",

                email:
                    admin.email || ""

            }
        );


        return;

    }

    catch (error) {

        console.log(
            "Login error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// GET PATIENTS
// =================================================

if (
    request.method === "GET" &&
    request.url === "/patients"
) {

    const patients =
        readData(
            patientsFile
        );


    sendResponse(
        response,
        200,
        patients
    );


    return;

}


// =================================================
// ADD PATIENT
// =================================================

if (
    request.method === "POST" &&
    request.url === "/patients"
) {

    try {

        const body =
            await getRequestBody(
                request
            );


        const patients =
            readData(
                patientsFile
            );


        if (!body.name) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Patient name is required"
                }
            );

            return;

        }


        const newPatient = {

            id:
                Date.now(),

            // Previous fields

            name:
                body.name,

            age:
                body.age,

            disease:
                body.disease,


            // New fields

            bloodGroup:
                body.bloodGroup,

            gender:
                body.gender,

            phone:
                body.phone

        };


        patients.push(
            newPatient
        );


        saveData(
            patientsFile,
            patients
        );


        sendResponse(
            response,
            201,
            newPatient
        );


        return;

    }

    catch (error) {

        console.log(
            "Add patient error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// UPDATE PATIENT
// =================================================

if (
    request.method === "PUT" &&
    request.url.startsWith(
        "/patients/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        const body =
            await getRequestBody(
                request
            );


        const patients =
            readData(
                patientsFile
            );


        const index =
            patients.findIndex(
                function(patient) {

                    return (
                        patient.id === id
                    );

                }
            );


        if (index === -1) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Patient not found"
                }
            );

            return;

        }


        patients[index] = {

            ...patients[index],

            // Previous fields

            name:
                body.name,

            age:
                body.age,

            disease:
                body.disease,


            // New fields

            bloodGroup:
                body.bloodGroup,

            gender:
                body.gender,

            phone:
                body.phone

        };


        saveData(
            patientsFile,
            patients
        );


        sendResponse(
            response,
            200,
            patients[index]
        );


        return;

    }

    catch (error) {

        console.log(
            "Update patient error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// DELETE PATIENT
// =================================================

if (
    request.method === "DELETE" &&
    request.url.startsWith(
        "/patients/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        let patients =
            readData(
                patientsFile
            );


        const patientExists =
            patients.some(
                function(patient) {

                    return (
                        patient.id === id
                    );

                }
            );


        if (!patientExists) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Patient not found"
                }
            );

            return;

        }


        patients =
            patients.filter(
                function(patient) {

                    return (
                        patient.id !== id
                    );

                }
            );


        saveData(
            patientsFile,
            patients
        );


        sendResponse(
            response,
            200,
            {
                message:
                    "Patient deleted successfully"
            }
        );


        return;

    }

    catch (error) {

        console.log(
            "Delete patient error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// GET DOCTORS
// =================================================

if (
    request.method === "GET" &&
    request.url === "/doctors"
) {

    const doctors =
        readData(
            doctorsFile
        );


    sendResponse(
        response,
        200,
        doctors
    );


    return;

}


// =================================================
// ADD DOCTOR
// =================================================

if (
    request.method === "POST" &&
    request.url === "/doctors"
) {

    try {

        const body =
            await getRequestBody(
                request
            );


        const doctors =
            readData(
                doctorsFile
            );


        if (!body.name) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Doctor name is required"
                }
            );

            return;

        }


        const newDoctor = {

            id:
                Date.now(),


            // Previous fields

            name:
                body.name,

            specialization:
                body.specialization,

            fee:
                body.fee,


            // New fields

            gender:
                body.gender,

            phone:
                body.phone,

            email:
                body.email,

            experience:
                body.experience,

            address:
                body.address

        };


        doctors.push(
            newDoctor
        );


        saveData(
            doctorsFile,
            doctors
        );


        sendResponse(
            response,
            201,
            newDoctor
        );


        return;

    }

    catch (error) {

        console.log(
            "Add doctor error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// UPDATE DOCTOR
// =================================================

if (
    request.method === "PUT" &&
    request.url.startsWith(
        "/doctors/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        const body =
            await getRequestBody(
                request
            );


        const doctors =
            readData(
                doctorsFile
            );


        const index =
            doctors.findIndex(
                function(doctor) {

                    return (
                        doctor.id === id
                    );

                }
            );


        if (index === -1) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Doctor not found"
                }
            );

            return;

        }


        doctors[index] = {

            ...doctors[index],


            // Previous fields

            name:
                body.name,

            specialization:
                body.specialization,

            fee:
                body.fee,


            // New fields

            gender:
                body.gender,

            phone:
                body.phone,

            email:
                body.email,

            experience:
                body.experience,

            address:
                body.address

        };


        saveData(
            doctorsFile,
            doctors
        );


        sendResponse(
            response,
            200,
            doctors[index]
        );


        return;

    }

    catch (error) {

        console.log(
            "Update doctor error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// DELETE DOCTOR
// =================================================

if (
    request.method === "DELETE" &&
    request.url.startsWith(
        "/doctors/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        let doctors =
            readData(
                doctorsFile
            );


        const doctorExists =
            doctors.some(
                function(doctor) {

                    return (
                        doctor.id === id
                    );

                }
            );


        if (!doctorExists) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Doctor not found"
                }
            );

            return;

        }


        doctors =
            doctors.filter(
                function(doctor) {

                    return (
                        doctor.id !== id
                    );

                }
            );


        saveData(
            doctorsFile,
            doctors
        );


        sendResponse(
            response,
            200,
            {
                message:
                    "Doctor deleted successfully"
            }
        );


        return;

    }

    catch (error) {

        console.log(
            "Delete doctor error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// GET APPOINTMENTS
// =================================================

if (
    request.method === "GET" &&
    request.url === "/appointments"
) {

    const appointments =
        readData(
            appointmentsFile
        );


    sendResponse(
        response,
        200,
        appointments
    );


    return;

}


// =================================================
// ADD APPOINTMENT
// =================================================

if (
    request.method === "POST" &&
    request.url === "/appointments"
) {

    try {

        const body =
            await getRequestBody(
                request
            );


        const patients =
            readData(
                patientsFile
            );


        const doctors =
            readData(
                doctorsFile
            );


        const appointments =
            readData(
                appointmentsFile
            );


        const patientId =
            Number(
                body.patientId
            );


        const doctorId =
            Number(
                body.doctorId
            );


        const patient =
            patients.find(
                function(item) {

                    return (
                        item.id ===
                        patientId
                    );

                }
            );


        const doctor =
            doctors.find(
                function(item) {

                    return (
                        item.id ===
                        doctorId
                    );

                }
            );


        if (!patient) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Patient not found"
                }
            );

            return;

        }


        if (!doctor) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Doctor not found"
                }
            );

            return;

        }


        if (!body.date) {

            sendResponse(
                response,
                400,
                {
                    message:
                        "Appointment date is required"
                }
            );

            return;

        }


        const newAppointment = {

            id:
                Date.now(),

            patientId:
                patient.id,

            patientName:
                patient.name,

            doctorId:
                doctor.id,

            doctorName:
                doctor.name,

            specialization:
                doctor.specialization,

            fee:
                doctor.fee,

            date:
                body.date,

            status:
                "scheduled"

        };


        appointments.push(
            newAppointment
        );


        saveData(
            appointmentsFile,
            appointments
        );


        sendResponse(
            response,
            201,
            newAppointment
        );


        return;

    }

    catch (error) {

        console.log(
            "Add appointment error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// UPDATE APPOINTMENT
// =================================================

if (
    request.method === "PUT" &&
    request.url.startsWith(
        "/appointments/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        const body =
            await getRequestBody(
                request
            );


        const appointments =
            readData(
                appointmentsFile
            );


        const index =
            appointments.findIndex(
                function(appointment) {

                    return (
                        appointment.id === id
                    );

                }
            );


        if (index === -1) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Appointment not found"
                }
            );

            return;

        }


        if (body.status) {

            appointments[index].status =
                body.status;

        }


        if (body.date) {

            appointments[index].date =
                body.date;

        }


        saveData(
            appointmentsFile,
            appointments
        );


        sendResponse(
            response,
            200,
            appointments[index]
        );


        return;

    }

    catch (error) {

        console.log(
            "Update appointment error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// DELETE APPOINTMENT
// =================================================

if (
    request.method === "DELETE" &&
    request.url.startsWith(
        "/appointments/"
    )
) {

    try {

        const id =
            Number(
                request.url
                    .split("/")[2]
            );


        let appointments =
            readData(
                appointmentsFile
            );


        const appointmentExists =
            appointments.some(
                function(appointment) {

                    return (
                        appointment.id === id
                    );

                }
            );


        if (!appointmentExists) {

            sendResponse(
                response,
                404,
                {
                    message:
                        "Appointment not found"
                }
            );

            return;

        }


        appointments =
            appointments.filter(
                function(appointment) {

                    return (
                        appointment.id !== id
                    );

                }
            );


        saveData(
            appointmentsFile,
            appointments
        );


        sendResponse(
            response,
            200,
            {
                message:
                    "Appointment deleted successfully"
            }
        );


        return;

    }

    catch (error) {

        console.log(
            "Delete appointment error:",
            error
        );


        sendResponse(
            response,
            500,
            {
                message:
                    "Server error"
            }
        );


        return;

    }

}


// =================================================
// INVALID ROUTE
// =================================================

sendResponse(
    response,
    404,
    {
        message:
            "Route not found"
    }
);


        }
    );


// =================================================
// START SERVER
// =================================================

server.listen(
    PORT,
    function() {

        console.log(
            "===================================="
        );

        console.log(
            "Hospital Management System Server"
        );

        console.log(
            "Server running on:"
        );

        console.log(
            "http://localhost:" +
            PORT
        );

        console.log(
            "===================================="
        );

    }
);
const express = require("express");
const app = express();
const path = require("path");
const mongoClient = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoClient
    .connect("mongodb://127.0.0.1:27017/InterviewHUB")
    .then(() => {
        console.log("DB is connected");
    })
    .catch(() => {
        console.log("DB is not connected");
    });

const interviewSchema = new mongoClient.Schema({
    studentRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    interviewExperience: {
        type: String,
        required: true,
    },
});

const InterviewModel = mongoClient.model("Interview", interviewSchema);

app.get("/", (req, res) => {
    res.render("index");
});

// app.get("/cool", (req, res) => {
//     res.render("InterviewSep");
// });

app.get("/interviews", async (req, res) => {
    const interviews = await InterviewModel.find();
    res.render("interviews", { Interviews: interviews });
});

app.get("/interviews/:regNo", async (req, res) => {
    const interviews = await InterviewModel.find();
    let found = false;

    interviews.forEach((curData) => {
        if (curData.studentRegistrationNumber === req.params.regNo) {
            found = true;
            //console.log("done");
            res.render("interviewSep", { Details: curData });
        }
    });

    if (!found) {
        res.status(404).send("Not Found");
    }
});

app.get("/shareExp", (req, res) => {
    res.render("shareExp");
});

app.post("/shareExp", async (req, res) => {
    const { regNo, phone, department, experience, company } = req.body;
    // console.log(regNo);
    // console.log(phone);
    // console.log(department);
    // console.log(experience);
    // console.log(company);
    try {
        const interview = await InterviewModel.create({
            studentRegistrationNumber: regNo,
            phoneNumber: phone,
            department: department,
            companyName: company,
            interviewExperience: experience,
        });

        await interview.save();
        res.render("confirm");
    } catch (err) {
        // If an error occurs, handle it and send an error response
        res.status(500).send(
            "Error sharing interview experience: " + err.message
        );
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/interviews", (req, res) => {
    res.render("interviews");
});

app.listen(3000, () => {
    console.log("Server is Running");
});

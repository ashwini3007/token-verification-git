var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var shelljs = require("shelljs")

var fs = require('fs')
var async = require('async')

app.get("/", function (req, res) {
    res.json({
        msg: "working"
    })
})

tasks = {}


//step 1
app.get("/generate-verification", function (req, res) {

    tracker = ("" + Math.random()).split(".")[1]
    tasks[tracker] = {
        token: Math.random().toString(36)
    }
    res.json(tasks[tracker])
})

//step 2
app.get('/fetch-repo', function (req, res) {
    tracker = req.query.tracker
    if (!tracker) {
        res.json({
            err: "Please provide tracker for this repo",
            tracker: {
                repo: "git repo url"
            }
        })
    }
    tasks[tracker] = {
        status: 'cloning',
        repo: req.query.url,
        claimedBy: "Bhushan"
    }
    folderName = req.query.url.split('/')
    folderName = folderName[folderName.length - 1].replace(".git", "")
    console.log(folderName)
    isAlreadyExists = fs.existsSync(folderName)

    res.json({
        tracker: tracker,
        isAlreadyExists: isAlreadyExists,
        folderName: folderName
    })
    if (!isAlreadyExists) {
        //https://github.com/caolan/async/blob/v1.5.2/README.md
        async.waterfall([
            downloadFile
        ], function (err, result) {
            // result now equals 'done'
            console.log("Done")
        });

        function downloadFile() {
            shelljs.exec('git clone ' + req.query.url, function (a, b, c) {
                tasks[tracker].status = 'cloned'
                console.log(a, b, c)
                if (fs.existsSync(folderName + '/package.json')) {
                    pkgData = fs.readFileSync(folderName + '/package.json', 'utf-8')
                    try {

                        pkgData = JSON.parse(pkgData)
                        if (pkgData.token == tasks[tracker].token) {
                            tasks[tracker].status = "verification successful"
                        } else {
                            tasks[tracker].status = "verification failed"
                        }
                    } catch (e) {
                        console.error("Failed to parse JSON")
                        tasks[tracker].status = "err : failed to parse package.json"
                    }

                }
            })
        }
    }
})

//step 3
app.get("/track-verification", function (req, res) {
    res.json(tasks[req.query.tracker])
})

app.listen(port, function () {

    console.log("Server started at " + port +
        " all incoming requests now can be served" +
        "\n\n\n###########################################")
});
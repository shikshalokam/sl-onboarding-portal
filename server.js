
//express
const express = require("express");
let app = express();
var path = require("path");



app.use('/', express.static('dist/sl-onboarding-portal'))
app.get("/*", function (req, res) {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, "/dist/sl-onboarding-portal/index.html"));
});

//listen to given port
app.listen(4151, () => {
  console.log(
    "Environment: " + "development"
  );
  console.log("Application is running on the port:" + 4500);
});

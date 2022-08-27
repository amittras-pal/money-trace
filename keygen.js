require("crypto").randomBytes(32, function (ex, buf) {
  var token = buf.toString("hex");
  console.log(token);
});

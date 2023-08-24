import app from "./src/app";
require("dotenv").config();

const port = process.env.PORT || 7070;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
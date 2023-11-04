import app from "./src/app";

const port = 7070;
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
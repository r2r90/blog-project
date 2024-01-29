import { app } from "./app";
import { runDb } from "./db/db";

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  console.log(`LISTENING ON PORT: ${port}`);
  await runDb();
});

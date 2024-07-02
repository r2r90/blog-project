import { app } from "./app";
import { runDb } from "./db/db";
import { appConfig } from "./config/config";

const port = appConfig.PORT || 4000;

app.listen(port, async () => {
  console.log(`LISTENING ON PORT: ${port}`);
  await runDb();
});

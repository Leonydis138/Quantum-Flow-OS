import { DashboardServer } from "./index";

const port = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 8080;
const server = new DashboardServer(port);

server
  .start()
  .then(() => {
    console.log(
      `🚀 Quantum Flow OS Dashboard Server successfully deployed and active on port ${port}`,
    );
  })
  .catch((err) => {
    console.error("❌ Failed to start Quantum Flow OS Dashboard Server:", err);
    process.exit(1);
  });

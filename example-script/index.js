import { pushMetrics } from "prometheus-remote-write";

const remoteWriteURL = "http://localhost:9091/api/v1/write"
// const remoteWriteURL = "https://metrics.mon.sabio.cloud/api/v1/push"

let counter = 0;

setInterval(async () => {
  console.log(`pushing counter: ${counter}`);
  counter += Math.floor(Math.random() * 10);
  await pushMetrics(
    {
      some_value: counter,
    },
    {
      url: remoteWriteURL,
      labels: {
        service: "some-batch-processing"
      },
      headers: {
        "Content-Type": "application/x-protobuf",
        "X-Scope-OrgID": "GCDC",
      }
    }
  );
}, "10000");

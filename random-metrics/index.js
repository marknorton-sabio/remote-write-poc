const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();

const metrics = {
  counter: 0,
  gauge: 50,
};

app.get("/health", (_req, res) => {
  console.log(`${new Date()} - healthcheck`);
  res.status(200).json({ok: 1});
});

app.get("/metrics", (_req, res) => {
  metrics.counter += Math.ceil(Math.random() * 10);
  if (Math.random() < 0.5) {
    metrics.gauge = Math.max(1, metrics.gauge * (1 - Math.random() / 10));
  } else {
    metrics.gauge = Math.min(100, metrics.gauge * (1 + Math.random() / 10));
  }

  console.log(`${new Date()} - scrape - ${JSON.stringify(metrics)}`);

  res.setHeader("content-type", "text/plain");
  res.send(`# HELP my_example_counter An example of a counter value, it always goes up (unless it resets)
# TYPE my_example_counter counter
my_example_counter ${metrics.counter}
# HELP my_example_gauge An example of a gauge value, it can go up and down
# TYPE my_example_gauge gauge
my_example_gauge ${metrics.gauge}
  `);
});

app.all("*", function (req, res) {
  console.log(req.originalUrl);
  res.status(200).json({url: req.originalUrl, headers: req.headers});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import * as Prometheus from "prom-client";

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new Prometheus.Counter({
  name: 'node_request_operations_total',
  help: 'The total number of requests received'
});

const histogram = new Prometheus.Histogram({
  name: 'node_request_duration_seconds',
  help: 'Histogram for duration of requests in seconds',
  buckets: [1, 2, ,3 ,4 ,5, ,6],
  // labelNames: [ 'path', 'status' ]
});

export {
  counter,
  histogram,
  Prometheus
}

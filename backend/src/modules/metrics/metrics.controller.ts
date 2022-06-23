import { Controller, Header, Get, Request, Response } from '@nestjs/common';
import Prometheus from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor() {}
  @Get()
  @Header('Content-type', Prometheus.register.contentType)
  metrics(@Request() req, @Response() res) {
      // Prometheus instrumentation
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    const httpRequestDurationMicroSeconds = new Prometheus.Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP request in ms',
      labelNames: ['route'],
      buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
    });
    httpRequestDurationMicroSeconds
      .labels(req.route.path)
      .observe(responseTimeInMs);
    return Prometheus.register.metrics();
  };
}

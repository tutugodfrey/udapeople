import { Controller, Header, Get, Request, Response } from '@nestjs/common';
import { Prometheus } from './handlers/handler';

@Controller('metrics')
export class MetricsController {
  constructor() {}
  @Get()
  @Header('Content-type', Prometheus.register.contentType)
  async metrics(@Request() req, @Response() res) {
    console.log(req.body);
    const collectedMetrics = await Prometheus.register.metrics();
    console.log(collectedMetrics);
    res.send(collectedMetrics);
  };
}

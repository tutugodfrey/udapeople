import { Get, Controller } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { counter, histogram } from '../metrics/handlers/handler'

@Controller('/api/status')
export class StatusController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async status() {
    const start = new Date().valueOf();
    const version = this.configService.about.version;
    const environment = this.configService.about.environment;
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
    return {
      status: 'ok',
      version,
      environment,
    };
  }
}

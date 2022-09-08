import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpConfigService } from 'src/shared/http/http.service';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';
import { IssuesController } from './issues/issues.controller';
import { IssuesService } from './issues/issues.service';
import { LogsController } from './logs/logs.controller';
import { LogsService } from './logs/logs.service';
import { ModelsController } from './models/models.controller';
import { ModelsService } from './models/models.service';
import { OverviewController } from './overview/overview.controller';
import { OverviewService } from './overview/overview.service';
import { PayloadsController } from './payloads/payloads.controller';
import { PayloadsService } from './payloads/payloads.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [
    GraphController,
    IssuesController,
    ModelsController,
    OverviewController,
    PayloadsController,
    LogsController,
  ],
  providers: [
    GraphService,
    IssuesService,
    ModelsService,
    OverviewService,
    PayloadsService,
    LogsService,
  ],
})
export class AdminModule {}

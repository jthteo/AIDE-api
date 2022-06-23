import { Module } from '@nestjs/common';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';
import { IssuesController } from './issues/issues.controller';
import { IssuesService } from './issues/issues.service';
import { ModelsController } from './models/models.controller';
import { ModelsService } from './models/models.service';
import { OverviewController } from './overview/overview.controller';
import { OverviewService } from './overview/overview.service';
import { PayloadsController } from './payloads/payloads.controller';
import { PayloadsService } from './payloads/payloads.service';

@Module({
  controllers: [
    GraphController,
    IssuesController,
    ModelsController,
    OverviewController,
    PayloadsController,
  ],
  providers: [
    GraphService,
    IssuesService,
    ModelsService,
    OverviewService,
    PayloadsService,
  ],
})
export class AdminModule {}

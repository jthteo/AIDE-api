/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RolesService } from 'modules/roles/roles.service';
import { HttpConfigService } from 'shared/http/http.service';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, RolesService, KeycloakAdminService],
})
export class WorkflowsModule {}

import { Args, Query, Resolver } from '@nestjs/graphql'; 
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { CommunicationLog } from './entities/communication-log.entity';
import { CommunicationLogService } from './communication-log.service';
import { CommunicationSentStatus } from 'src/commonTypes';

export const communicationLogClassTypeResolver = () => CommunicationLog;
export const communicationLogListClassTypeResolver = () => [CommunicationLog];

@Resolver(communicationLogClassTypeResolver)
export class CommunicationLogResolver {
  constructor(private communicationLogService: CommunicationLogService) {}

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(communicationLogClassTypeResolver, { nullable: true })
  async communicationLogById(@Args('id', { type: () => String }) id: string) {
    return await this.communicationLogService.getCommunication(id);
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(communicationLogListClassTypeResolver)
  async allCommunicationLogs() {
    return await this.communicationLogService.getCommunications();
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(communicationLogListClassTypeResolver)
  async allCommunicationLogsBySentStatus(
    @Args('status', { type: () => String }) status: CommunicationSentStatus,
  ) {
    return await this.communicationLogService.getCommunicationsBySentStatus(
      status,
    );
  }
}

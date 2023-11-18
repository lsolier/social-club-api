import { Module } from '@nestjs/common';
import { ClubMemberService } from './club-member.service';

@Module({
  providers: [ClubMemberService]
})
export class ClubMemberModule {}

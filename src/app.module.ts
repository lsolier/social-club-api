import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { ClubModule } from './club/club.module';
import { ClubMemberModule } from './club-member/club-member.module';

@Module({
  imports: [MemberModule, ClubModule, ClubMemberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

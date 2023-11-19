import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ClubMemberService } from './club-member.service';
import { MemberDto } from 'src/member/member.dto';
import { plainToInstance } from 'class-transformer';
import { MemberEntity } from 'src/member/member.entity';

@Controller('clubs')
export class ClubMemberController {

    constructor(private readonly clubMemberService: ClubMemberService) {}

    @Post(':clubId/members/:memberId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.clubMemberService.addMemberToClub(clubId, memberId);
    }

    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.clubMemberService.findMemberFromClub(clubId, memberId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.clubMemberService.findMembersFromClub(clubId);
    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Body() membersDto: MemberDto[], @Param('clubId') clubId: string){
       const members = plainToInstance(MemberEntity, membersDto)
       return await this.clubMemberService.updateMembersFromClub(clubId, members);
    }

    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.clubMemberService.deleteMemberFromClub(clubId, memberId);
    }

}

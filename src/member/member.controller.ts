import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MemberService } from './member.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { MemberDto } from './member.dto';
import { MemberEntity } from './member.entity';
import { plainToInstance } from 'class-transformer';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class MemberController {

    constructor(private readonly memberService: MemberService) {}

    @Get()
    async findAll() {
      return await this.memberService.findAll();
    }

    @Get(':memberId')
    async findOne(@Param('memberId') memberId: string) {
      return await this.memberService.findOne(memberId);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() memberDto: MemberDto) {
      const member: MemberEntity = plainToInstance(MemberEntity, memberDto);
      return await this.memberService.create(member);
    }

    @Put(':memberId')
    async update(@Param('memberId') memberId: string, @Body() clubDto: MemberDto) {
      const member: MemberEntity = plainToInstance(MemberEntity, clubDto);
      return await this.memberService.update(memberId, member);
    }

    @Delete(':memberId')
    @HttpCode(204)
    async delete(@Param('memberId') memberId: string) {
      return await this.memberService.delete(memberId);
    }

}

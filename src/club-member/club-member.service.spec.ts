import { Test, TestingModule } from '@nestjs/testing';
import { ClubMemberService } from './club-member.service';
import { ClubEntity } from '../club/club.entity';
import { MemberEntity } from '../member/member.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubMemberService', () => {
  let service: ClubMemberService;
  let clubRepository: Repository<ClubEntity>;
  let memberRepository: Repository<MemberEntity>;
  let club: ClubEntity;
  let membersList : MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubMemberService],
    }).compile();

    service = module.get<ClubMemberService>(ClubMemberService);

    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity))
    memberRepository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity))
    await seedDatabase();
  });

  const seedDatabase = async () => {
    memberRepository.clear();
    clubRepository.clear();
 
    membersList = [];
    for(let i = 0; i < 5; i++){
        const member: MemberEntity = await memberRepository.save({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          birthday: faker.date.birthdate()
        })
        membersList.push(member);
    }
 
    club = await clubRepository.save({
      name: faker.person.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.avatar(),
      description: faker.lorem.word(100),
      members: membersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to a club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });
 
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.person.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.avatar(),
      description: faker.lorem.word(100)
    })
 
    const result: ClubEntity = await service.addMemberToClub(newClub.id, newMember.id);
   
    expect(result.members.length).toBe(1);
    expect(result.members[0]).not.toBeNull();
    expect(result.members[0].name).toBe(newMember.name)
    expect(result.members[0].email).toBe(newMember.email)
    expect(result.members[0].birthday).toEqual(newMember.birthday)
  });

  it('addMemberToClub should thrown exception for an invalid member', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.person.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.avatar(),
      description: faker.lorem.word(100)
    })
 
    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });
 
    await expect(() => service.addMemberToClub("0", newMember.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMemberFromClub should return member from club', async () => {
    const member: MemberEntity = membersList[0];
    const storedMember: MemberEntity = await service.findMemberFromClub(club.id, member.id, )
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toBe(member.name);
    expect(storedMember.email).toBe(member.email);
    expect(storedMember.birthday).toEqual(member.birthday);
  });

  it('findMemberFromClub should throw an exception for an invalid member', async () => {
    await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    const member: MemberEntity = membersList[0];
    await expect(()=> service.findMemberFromClub("0", member.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMemberFromClub should throw an exception for an member not associated to the club', async () => {
    const member: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });
 
    await expect(()=> service.findMemberFromClub(club.id, member.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

  it('findMembersFromClub should return members by club', async ()=>{
    const members: MemberEntity[] = await service.findMembersFromClub(club.id);
    expect(members.length).toBe(5)
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updateMembersFromClub should update members list for a club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });
 
    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newMember]);
    expect(updatedClub.members.length).toBe(1);
 
    expect(updatedClub.members[0].name).toBe(newMember.name);
    expect(updatedClub.members[0].email).toBe(newMember.email);
    expect(updatedClub.members[0].birthday).toEqual(newMember.birthday);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });

    await expect(()=> service.updateMembersFromClub("0", [newMember])).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updateMembersFromClub should throw an exception for an invalid member', async () => {
    const newMember: MemberEntity = membersList[0];
    newMember.id = "0";
 
    await expect(()=> service.updateMembersFromClub(club.id, [newMember])).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberFromClub should remove an member from a club', async () => {
    const member: MemberEntity = membersList[0];
   
    await service.deleteMemberFromClub(club.id, member.id);
 
    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["members"]});
    const deletedMember: MemberEntity = storedClub.members.find(a => a.id === member.id);
 
    expect(deletedMember).toBeUndefined();
 
  });

  it('deleteMemberFromClub should thrown an exception for an invalid member', async () => {
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberFromClub should thrown an exception for an invalid club', async () => {
    const member: MemberEntity = membersList[0];
    await expect(()=> service.deleteMemberFromClub("0", member.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('deleteMemberFromClub should thrown an exception for an non asocciated restaurante', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate()
    });
 
    await expect(()=> service.deleteMemberFromClub(club.id, newMember.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

});

import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Repository } from 'typeorm';
import { MemberEntity } from './member.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;
  let membersList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    membersList = [];
    for(let i = 0; i < 5; i++){
        const member: MemberEntity = await repository.save({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          birthday: faker.date.birthdate()
        })
        membersList.push(member);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(membersList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMember: MemberEntity = membersList[0];
    const member: MemberEntity = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.name).toEqual(storedMember.name)
    expect(member.email).toEqual(storedMember.email)
    expect(member.birthday).toEqual(storedMember.birthday)
  });

  it('findOne should throw an exception for an invalid member', async () => {
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.findOne(incorrect_id)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('create should return a new member', async () => {
    const member: MemberEntity = {
      id: "0",
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthday: faker.date.birthdate(),
      clubs: [],
    }
 
    const newMember: MemberEntity = await service.create(member);
    expect(newMember).not.toBeNull();
 
    const storedMember: MemberEntity = await repository.findOne({where: {id: newMember.id}})
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(newMember.name)
    expect(storedMember.email).toEqual(newMember.email)
    expect(storedMember.birthday).toEqual(newMember.birthday)
  });

  it('update should modify a member', async () => {
    const member: MemberEntity = membersList[0];
    member.name = "new Member";
    const updatedMember: MemberEntity = await service.update(member.id, member);
    expect(updatedMember).not.toBeNull();
    const storedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(member.name)
    expect(storedMember.email).toEqual(member.email)
    expect(storedMember.birthday).toEqual(member.birthday)
  });

  it('update should throw an exception for an invalid member', async () => {
    let member: MemberEntity = membersList[0];
    member = {
      ...member, name: "Nuevo nombre"
    }
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.update(incorrect_id, member)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('delete should remove a member', async () => {
    const member: MemberEntity = membersList[0];
    await service.delete(member.id);
    const deletedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.delete(incorrect_id)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

});

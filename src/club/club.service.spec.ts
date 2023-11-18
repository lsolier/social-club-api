import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
          name: faker.person.fullName(),
          foundationDate: faker.date.birthdate(),
          image: faker.image.avatar(),
          description: faker.lorem.word(100)
        })
        clubsList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name)
    expect(club.foundationDate).toEqual(storedClub.foundationDate)
    expect(club.image).toEqual(storedClub.image)
    expect(club.description).toEqual(storedClub.description)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.findOne(incorrect_id)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "0",
      name: faker.person.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.avatar(),
      description: faker.lorem.word(100),
      members: [],
    }
 
    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();
 
    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name)
    expect(storedClub.foundationDate).toEqual(newClub.foundationDate)
    expect(storedClub.image).toEqual(newClub.image)
    expect(storedClub.description).toEqual(newClub.description)
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubsList[0];
    club.name = "new Club";
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name)
    expect(storedClub.foundationDate).toEqual(club.foundationDate)
    expect(storedClub.image).toEqual(club.image)
    expect(storedClub.description).toEqual(club.description)
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, name: "Nuevo nombre"
    }
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.update(incorrect_id, club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    let incorrect_id = "00000000-0000-0000-0000-000000000000";
    await expect(() => service.delete(incorrect_id)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

});

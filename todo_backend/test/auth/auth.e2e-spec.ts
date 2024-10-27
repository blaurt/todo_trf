import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserStatus } from 'src/domain/user/user-status.enum';
import { User } from 'src/domain/user/user.entity';
import request from 'supertest';

import { Repository } from 'typeorm';
import { UserRepository } from '../../src/domain/user/repositories/user.repository';

describe('Auth controller (e2e)', () => {
  let app: INestApplication;
  let usersRepo: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersRepo = app.get(UserRepository)['usersRepository'];
    await app.init();
  });

  beforeEach(async () => {
    await usersRepo.delete({});
  });

  describe('Sign-up', () => {
    describe('success flow', () => {
      it('should successfully create new user', async () => {
        const signupPayload = {
          firstName: 'fName',
          lastName: 'lastName',
          password: 'testpassword',
          repeatPassword: 'testpassword',
          email: 'test@email.com',
        };
        const signupResponse = await request(app.getHttpServer()).post('/api/v1/auth/signup').send(signupPayload);

        expect(signupResponse.status).toBe(201);
      });
    });

    describe('error flow', () => {
      it("should receive an error - passwords don't match", async () => {
        const signupPayload = {
          firstName: 'fName',
          lastName: 'lastName',
          password: 'testpassword',
          repeatPassword: 'not-match',
          email: 'test@email.com',
        };
        const signupResponse = await request(app.getHttpServer()).post('/api/v1/auth/signup').send(signupPayload);

        expect(signupResponse.status).toBe(400);
        expect(signupResponse.body.message).toBe('Passwords do not match');
      });

      it('should receive an error - user already exists', async () => {
        await usersRepo.save(
          new User({
            firstName: 'fName',
            lastName: 'lastName',
            passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
            email: 'test@email.com',
            status: UserStatus.ACTIVE,
          }),
        );

        const signupPayload = {
          firstName: 'fName',
          lastName: 'lastName',
          password: 'testpassword',
          repeatPassword: 'not-match',
          email: 'test@email.com',
        };

        const signupResponse = await request(app.getHttpServer()).post('/api/v1/auth/signup').send(signupPayload);

        expect(signupResponse.status).toBe(400);
        expect(signupResponse.body.message).toBe('User with this email already exists');
      });
    });
  });

  describe('Login', () => {
    describe('success flow', () => {
      it('should log a user in', async () => {
        const signupPayload = {
          firstName: 'fName',
          lastName: 'lastName',
          passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
          email: 'test@email.com',
        };

        await usersRepo.save(
          new User({
            firstName: 'fName',
            lastName: 'lastName',
            passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
            email: 'test@email.com',
            status: UserStatus.ACTIVE,
          }),
        );

        const signinResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
          email: 'test@email.com',
          password: 'testpassword',
        });

        expect(signinResponse.status).toBe(200);
        expect(signinResponse.body.user).toHaveProperty('id');
        expect(signinResponse.body.user).toHaveProperty('createdAt');
        expect(signinResponse.body.user).toMatchObject({
          email: expect.stringMatching(signupPayload.email),
          firstName: expect.stringMatching(signupPayload.firstName),
          lastName: expect.stringMatching(signupPayload.lastName),
        });
        expect(signinResponse.body).toHaveProperty('access_token');
      });
    });
    describe('error flow', () => {
      it('should not log a user in - wrong password', async () => {
        await usersRepo.save(
          new User({
            firstName: 'fName',
            lastName: 'lastName',
            passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
            email: 'test@email.com',
            status: UserStatus.ACTIVE,
          }),
        );

        const signinResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
          email: 'test@email.com',
          password: 'not match',
        });

        expect(signinResponse.status).toBe(404);
        expect(signinResponse.body.message).toBe('Invalid email or password');
      });

      it('should not log a user in - user not exists', async () => {
        await usersRepo.save(
          new User({
            firstName: 'fName',
            lastName: 'lastName',
            passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
            email: 'test@email.com',
            status: UserStatus.ACTIVE,
          }),
        );

        const signinResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
          email: 'test@email.com',
          password: 'not match',
        });

        expect(signinResponse.status).toBe(404);
        expect(signinResponse.body.message).toBe('Invalid email or password');
      });

      it('should not log a user in - password is missing', async () => {
        await usersRepo.save(
          new User({
            firstName: 'fName',
            lastName: 'lastName',
            passwordHash: '$2b$08$D8gkb/XdvToAzgUd.vAXNOpbpp0TN0zgkN0aqyPMiakmnPT5gf6R.',
            email: 'test@email.com',
            status: UserStatus.ACTIVE,
          }),
        );

        const signinResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
          email: 'test@email.com',
        });

        expect(signinResponse.status).toBe(400);
      });
    });
  });
});

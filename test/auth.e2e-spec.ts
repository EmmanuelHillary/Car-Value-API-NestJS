import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication Test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles user signup request', async () => {
    const username = "Pointless";
    const email = "Pointless@mail.com";
    const password = "dfnvfjdnfdnv"

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({username, email, password})
      .expect(201)
      .then(res => {
        const { id, username, email } = res.body
        expect(id).toBeDefined() 
        expect(email).toEqual(email)
        expect(username).toEqual(username)
      });
  });

  it("it signs up a new user and confirms the current user", async () => {
    const username = "Pointless";
    const email = "Pointless@mail.com";
    const password = "dfnvfjdnfdnv"

    const res = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({username, email, password})
    .expect(201);

    const cookie = res.get("Set-Cookie")

    const { body } = await request(app.getHttpServer())
    .get("/auth/whoami")
    .set("Cookie", cookie)
    .expect(200)

    expect(body.email).toEqual(email)
    expect(body.username).toEqual(username)
  });


});

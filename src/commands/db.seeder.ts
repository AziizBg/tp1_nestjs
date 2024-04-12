import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { UserService } from '../user/user.service';
import {
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
} from '@ngneat/falso';

// import { UserRoleEnum } from '../enums/user-role.enum';
import { CV } from '../cv/entities/cv.entity';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cvService = app.get(CvService);
  const userService = app.get(UserService);
  //   const users = await userService.findAll({role: UserRoleEnum.USER});
  const users = userService.findAll();
  for (let i = 1; i < 10; i++) {
    const newCv = new CV();
    newCv.firstname = randFirstName();
    newCv.name = randLastName();
    newCv.age = Math.floor(Math.random() * 100);
    newCv.cin = randNumber({ min: 10000000, max: 99999999 });
    newCv.job = randJobTitle();
    // newCv.user= users[Math.floor(Math.random() * users.length)];

    newCv.path = '';
    console.log('the new cv to add', newCv);
    // const user = users[Math.floor(Math.random() * users.length)];
    // await cvService.create(newCv, user);
  }
  await app.close();
}
bootstrap();

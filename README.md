# Prisma Seeder Tools

[![npm version](https://badge.fury.io/js/%40technote-space%2Fprisma-seeder-tools.svg)](https://badge.fury.io/js/%40technote-space%2Fprisma-seeder-tools)
[![CI Status](https://github.com/technote-space/prisma-seeder-tools/workflows/CI/badge.svg)](https://github.com/technote-space/prisma-seeder-tools/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/prisma-seeder-tools/badge)](https://www.codefactor.io/repository/github/technote-space/prisma-seeder-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/prisma-seeder-tools/blob/master/LICENSE)

Seeder tools for prisma

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Install

`yarn add @technote-space/prisma-seeder-tools`

or

`npm i @technote-space/prisma-seeder-tools`

### Use

e.g.

```tsx
import {PrismaClient} from './client';
import {seed, createDefinition, Seeder} from '@technote-space/prisma-seeder-tools';

class RoomSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.factory('room').createMany(5);
  }
}
class GuestSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.factory('guest').createMany(10);
  }
}
class ReservationSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    const rooms  = await this.factory('room').list();
    const guests = await this.factory('guest').list();
    await [...Array(300)].reduce(async prev => {
      await prev;
      await this.factory('reservation').create({}, rooms.random(), guests.random());
    }, Promise.resolve());
  }
}

(async() => {
  const prisma = new PrismaClient();
  await seed(prisma, [
    createDefinition('guest', faker => ({
      email: `${faker.random.number()}${faker.random.number()}@example.com`,
      name: `${faker.name.lastName()} ${faker.name.firstName()}`,
      phone: faker.phone.phoneNumber(),
    })),
    createDefinition('room', faker => ({
      name: faker.name.firstName() + faker.random.number(),
      number: faker.random.number({ min: 1, max: 10 }),
      price: faker.random.number({ min: 1000, max: 100000 }),
    })),
    createDefinition('reservation', (faker, params) => {
      const room = params[0] as Room;
      const guest = params[1] as Guest;
      const number = faker.random.number({ min: 1, max: room.number });
      const checkin = faker.date.between(faker.date.past(2), faker.date.future(2));
      checkin.setHours(15, 0, 0, 0);
      const nights = faker.random.number({ min: 1, max: 7 });
      const checkout = new Date(checkin.valueOf());
      checkout.setDate(checkin.getDate() + nights);
      checkout.setHours(10, 0, 0, 0);
      const amount = room.price * number * nights;

      return {
        checkin,
        checkout,
        status,
        number,
        amount,
        room: {
          connect: {
            id: room.id,
          },
        },
        guest: {
          connect: {
            id: guest.id,
          },
        },
      };
    }),
  ], [
    new GuestSeeder(prisma),
    new RoomSeeder(prisma),
    new ReservationSeeder(prisma),
  ]);
})();
```

## Author

[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)

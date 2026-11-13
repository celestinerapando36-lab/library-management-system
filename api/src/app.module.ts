import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { GenresModule } from './genres/genres.module.js';
import { BooksModule } from './books/books.module.js';
import { TodosModule } from './todos/todos.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    GenresModule,
    BooksModule,
    TodosModule,
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'power-patrol',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
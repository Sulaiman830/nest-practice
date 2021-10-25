import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ProductsModule,
    FeedModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type:'postgres',
      // host:process.env.POSTGRES_HOST,
      // port:parseInt(<string>process.env.POSTGRES_PORT),
      // username:process.env.POSTGRES_USER,
      // password:process.env.POSTGRES_PASSWORD,
      // database:process.env.POSTGRES_DATABASE,
      host:'ec2-54-228-139-34.eu-west-1.compute.amazonaws.com',
      port:5432,
      username:'fgymfoyxnpgljt',
      password:'2f3fd0e7e65d72d88d3f61a22f5c036f4121f69a7b95b8eca649c8e4b9f7e596',
      database:'d68duj5d9qicuf',
      autoLoadEntities:true,
      // synchronize:true
   })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

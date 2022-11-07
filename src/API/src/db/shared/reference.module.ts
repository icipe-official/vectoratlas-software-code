import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceResolver } from './reference.resolver';
import { Reference } from './entities/reference.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reference]), AuthModule],
  providers: [ReferenceService, ReferenceResolver],
  exports: [ReferenceService],
})
export class ReferenceModule {}

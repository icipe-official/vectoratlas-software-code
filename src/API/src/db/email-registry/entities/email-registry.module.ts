import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EmailRegistry} from './email-registry.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmailRegistry])],

    controllers: [],
    providers: [],
    exports: [TypeOrmModule]
})

export class EmailRegistryModule {}


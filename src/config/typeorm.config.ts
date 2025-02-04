import {TypeOrmModuleOptions} from '@nestjs/typeorm'
import {File} from '../entitities/file.entity'
import {User} from "../entitities/user.entity";
import {Pack} from "../entitities/pack.entity";

export const typeormConfig: TypeOrmModuleOptions = {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "vadim_develop",
        password: "vadim",
        database: "db",
        synchronize: true,
        entities: [File, User, Pack]
}
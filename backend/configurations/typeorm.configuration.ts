import { Configuration } from '@nailyjs/ioc'
import { CustomDataSource } from '@nailyjs/typeorm'
import { DataSourceOptions } from 'typeorm'

@Configuration(CustomDataSource)
export class TypeOrmConfiguration implements CustomDataSource {
  configure(oldOptions: DataSourceOptions): DataSourceOptions | Promise<DataSourceOptions> {
    // In vite environment, we cannot define `entities` in this implementation.
    // If you define here, the app will be crash, and throw error `Cannot find XXX entity metadata in this dataSource`.
    // ! Please configure `entities` in the `main.ts` `TypeOrmPlugin({ entities: /* This */ })` instead.

    return {
      ...oldOptions,
      logging: true,
    }
  }
}

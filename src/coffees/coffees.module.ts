import { Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigModule } from '@nestjs/config';

class ConfigService { }
class DevelopmentConfigService { }
class ProductionConfigService { }

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        return ['buddy brew', 'nescafe']
    }
}


@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
    controllers: [CoffeesController],
    providers: [CoffeesService,
        CoffeeBrandsFactory,
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development'
                ? DevelopmentConfigService
                : ProductionConfigService
        }
        , {
            provide: COFFEE_BRANDS,
            useFactory: async (brandsFactory: CoffeeBrandsFactory) => {
                const brands = await Promise.resolve(brandsFactory.create())
                console.log('[!] Async factory')
                return brands
            },
            inject: [CoffeeBrandsFactory],
            scope: Scope.TRANSIENT
        }],
    exports: [CoffeesService]
})
export class CoffeesModule { }

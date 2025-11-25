import { Module } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { DateUtilsService } from '../utils/date-utils.service';
import { PrestamoRepository } from './prestamo.repository';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [UsuarioModule],
  controllers: [PrestamoController],
  providers: [PrestamoService, PrestamoRepository, DateUtilsService],
  exports: [PrestamoService, PrestamoRepository],
})
export class PrestamoModule {}

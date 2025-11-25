import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { LibroModule } from './libro/libro.module';
import { DateUtilsService } from './utils/date-utils.service';

@Module({
  imports: [PrismaModule, PrestamoModule, UsuarioModule, LibroModule],
  controllers: [AppController],
  providers: [AppService, DateUtilsService],
})
export class AppModule {}

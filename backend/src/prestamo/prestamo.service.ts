import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { PrestamoResponseDto } from './dto/prestamo-response.dto';
import { DateUtilsService } from '../utils/date-utils.service';
import { PrestamoRepository } from './prestamo.repository';
import { USER_TYPES } from '../models/user.models';
import { UsuarioRepository } from '../usuario/usuario.repository';

@Injectable()
export class PrestamoService {
  constructor(
    private readonly dateUtils: DateUtilsService,
    private readonly prestamoRepository: PrestamoRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async create(
    createPrestamoDto: CreatePrestamoDto,
  ): Promise<PrestamoResponseDto> {
    const { isbn, identificacionUsuario } = createPrestamoDto;

    let tipoUsuario: number;
    try {
      tipoUsuario = await this.usuarioRepository.findTipoUsuario(
        identificacionUsuario,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al validar el usuario.');
    }

    if (tipoUsuario === (USER_TYPES.INVITADO as number)) {
      await this.validateInvitedUserLimit(identificacionUsuario);
    }

    const fechaMaximaDevolucion = this.dateUtils.calculateReturnDate(
      tipoUsuario as
        | USER_TYPES.AFILIADO
        | USER_TYPES.EMPLEADO
        | USER_TYPES.INVITADO,
    );

    const prestamoData = {
      isbn,
      identificacionUsuario,
      fechaPrestamo: new Date(),
      fechaMaximaDevolucion,
    };

    const prestamo = await this.prestamoRepository.save(prestamoData);
    return new PrestamoResponseDto(prestamo);
  }

  private async validateInvitedUserLimit(
    identificacionUsuario: string,
  ): Promise<void> {
    const activeLoans = await this.prestamoRepository.countActiveLoansByUser(
      identificacionUsuario,
    );

    if (activeLoans >= 1) {
      throw new BadRequestException('El usuario ya tiene un libro prestado');
    }
  }

  async findAll(): Promise<PrestamoResponseDto[]> {
    const prestamos = await this.prestamoRepository.findAll();
    return prestamos.map((prestamo) => new PrestamoResponseDto(prestamo));
  }

  async findOne(id: string): Promise<PrestamoResponseDto> {
    const prestamo = await this.prestamoRepository.findById(id);
    return new PrestamoResponseDto(prestamo);
  }
}

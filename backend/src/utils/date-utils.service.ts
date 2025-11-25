import { Injectable } from '@nestjs/common';
import { TipoUsuario } from '../prestamo/dto/create-prestamo.dto';
import { USER_TYPES, DEVOLUTION_DAYS } from '../models/user.models';

@Injectable()
export class DateUtilsService {
  private getDaysToSum(tipoUsuario: TipoUsuario): number {
    switch (tipoUsuario) {
      case USER_TYPES.AFILIADO:
        return DEVOLUTION_DAYS.AFILIADO_DAYS;
      case USER_TYPES.EMPLEADO:
        return DEVOLUTION_DAYS.EMPLEADO_DAYS;
      case USER_TYPES.INVITADO:
        return DEVOLUTION_DAYS.INVITADO_DAYS;
      default:
        throw new Error(
          'Tipo de usuario no reconocido para el cálculo de fecha.',
        );
    }
  }

  public calculateReturnDate(tipoUsuario: TipoUsuario): Date {
    const currentDate = new Date();
    let workingDays = this.getDaysToSum(tipoUsuario);

    currentDate.setDate(currentDate.getDate() + 1);

    while (workingDays > 0) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays--;
      }

      if (workingDays > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        break;
      }
    }

    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }
}

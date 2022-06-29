import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateEmployeeRequest } from './requests/create-employee-request.interface';
import { SyncCommandDispatcher } from '../../common/commands';
import { CreateEmployee } from './commands/create-employee.command';
import { UpdateEmployee } from './commands/update-employee.command';
import { DeactivateEmployee } from './commands/deactivate-employee.command';
import { PaginatedEmployeeQuery } from './requests/paginated-employee-query.interface';
import { EmployeeRepository } from './repositories/employees.repository';
import { Usr } from '../../auth/user.decorator';
import { User } from '../../auth/user.interface';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeRequest } from './requests/update-employee-request.interface';
import { UpdateEmployeeName } from './commands/update-employee-name.command';
import { UpdateEmployeeAddress } from './commands/update-employee-address.command';
import { UpdateEmployeeDisplayName } from './commands/update-employee-display-name.command';
import { UpdateEmployeeTags } from './commands/update-employee-tags.command';
import { UpdateEmployeePhoneNumber } from './commands/update-employee-phone-number.command';
import { UpdateEmployeePersonalEmail } from './commands/update-employee-personal-email.command';
import { UpdateEmployeeCompanyEmail } from './commands/update-employee-company-email.command';
import { UpdateEmployeeSalary } from './commands/update-employee-salary.command';
import { UpdateEmployeeSalaryType } from './commands/update-employee-salary-type.command';
import { UpdateEmployeeEffectiveDate } from './commands/update-employee-effective-date.command';
import { UpdateEmployeeBirthdate } from './commands/update-employee-birthdate.command';
import { ActivateEmployee } from './commands/activate-employee.command';
import { histogram, counter } from '../../metrics/handlers/handler';

@Controller('/api/employees')
export class EmployeeController {
  constructor(
    private readonly commandDispatcher: SyncCommandDispatcher,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  @Post()
  async createEmployee(
    @Body() employeeRequest: CreateEmployeeRequest,
  ): Promise<Employee> {
    const start = new Date().valueOf();
    const employee = await this.employeeRepository.findByNames(
      employeeRequest.firstName,
      employeeRequest.middleName,
      employeeRequest.lastName,
      employeeRequest.secondLastName,
    );

    if (typeof employee !== 'undefined') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Duplicate employee',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const employee_ = await this.commandDispatcher.execute(
      new CreateEmployee(
        employeeRequest.firstName,
        employeeRequest.middleName,
        employeeRequest.lastName,
        employeeRequest.secondLastName,
        employeeRequest.displayName,
        employeeRequest.companyEmail,
        employeeRequest.personalEmail,
        employeeRequest.birthdate,
        employeeRequest.startDate,
        employeeRequest.address,
        employeeRequest.phoneNumber,
        employeeRequest.bankName,
        employeeRequest.accountNumber,
        employeeRequest.gender,
        employeeRequest.tags,
        employeeRequest.country,
        employeeRequest.region,
        employeeRequest.city,
        employeeRequest.salary,
        employeeRequest.effectiveDate,
        employeeRequest.salaryType,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
    return employee_;
  }


  @Get()
  async getEmployees(
    @Usr() user: User,
    @Query() query: PaginatedEmployeeQuery,
  ) {
    const start = new Date().valueOf();
    const pageSize = query.pageSize || 10;
    const pageNumber = query.pageNumber || 1;

    const notAllowed = ['pageSize', 'pageNumber'];

    const searchParams = Object.keys(query)
      .filter(key => !notAllowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = query[key];
        return obj;
      }, {});

    const employee = await this.employeeRepository
      .where(searchParams)
      .paginate(pageNumber, pageSize);
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
    return employee.data;
  }


  @Get(':id')
  async getById(
    @Param('id') employeeId: number,
  ) {
    const start = new Date().valueOf();
    const respose = await this.employeeRepository.findById(employeeId);
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
    return respose as Employee;
  }


  @Put()
  async updateEmployee(
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployee(
        employeeRequest.employeeId,
        employeeRequest.firstName,
        employeeRequest.middleName,
        employeeRequest.lastName,
        employeeRequest.secondLastName,
        employeeRequest.displayName,
        employeeRequest.companyEmail,
        employeeRequest.personalEmail,
        employeeRequest.birthdate,
        employeeRequest.address,
        employeeRequest.phoneNumber,
        employeeRequest.bankName,
        employeeRequest.accountNumber,
        employeeRequest.tags,
        employeeRequest.country,
        employeeRequest.region,
        employeeRequest.city,
        employeeRequest.salary,
        employeeRequest.effectiveDate,
        employeeRequest.salaryType,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/names')
  async changeNames(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeName(
        employeeId,
        employeeRequest.firstName,
        employeeRequest.middleName,
        employeeRequest.lastName,
        employeeRequest.secondLastName,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/address')
  async changeAddress(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeAddress(
        employeeId,
        employeeRequest.address,
        employeeRequest.country,
        employeeRequest.region,
        employeeRequest.city,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/displayName')
  async changeDisplayName(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeDisplayName(employeeId, employeeRequest.displayName),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/tags')
  async changeTags(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeTags(employeeId, employeeRequest.tags),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/phoneNumber')
  async changePhoneNumber(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeePhoneNumber(employeeId, employeeRequest.phoneNumber),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/personalEmail')
  async changePersonalEmail(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeePersonalEmail(
        employeeId,
        employeeRequest.personalEmail,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/companyEmail')
  async changeCompanyEmail(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeCompanyEmail(employeeId, employeeRequest.companyEmail),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/salary')
  async changeSalary(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeSalary(employeeId, employeeRequest.salary),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/salaryType')
  async changeSalaryType(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeSalaryType(employeeId, employeeRequest.salaryType),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/effectiveDate')
  async changeEffectiveDate(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeEffectiveDate(
        employeeId,
        employeeRequest.effectiveDate,
      ),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/birthdate')
  async changeBirthDate(
    @Param('id') employeeId: number,
    @Body() employeeRequest: UpdateEmployeeRequest,
  ): Promise<void> {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new UpdateEmployeeBirthdate(employeeId, employeeRequest.birthdate),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/inactive')
  async deactivateEmployee(
    @Param('id') employeeId: number,
  ) {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new DeactivateEmployee(employeeId, false),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }

  @Put(':id/active')
  async activateEmployee(
    @Param('id') employeeId: number,
  ) {
    const start = new Date().valueOf();
    await this.commandDispatcher.execute(
      new ActivateEmployee(employeeId, true),
    );
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
  }
}

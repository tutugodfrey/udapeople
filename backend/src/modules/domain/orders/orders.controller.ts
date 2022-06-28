import { SyncCommandDispatcher } from '../../common/commands';
import { OrderRequest } from './requests/orderRequest';
import { Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { CreateOrder } from './commands/createOrder';
import { OrderRepository } from './repositories/orderRepository';
import { PaginatedOrderQuery } from './requests/PaginatedOrderQuery';
import { PassportModule} from "@nestjs/passport";
// import { ProductRepository } from './repositories/productRepository';
// import { PaginatedProductQuery } from './requests/paginatedProductQuery';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../../auth/user.decorator';
import { User } from '../../auth/user.interface';
import { histogram, counter } from '../../metrics/handlers/handler';

@Controller('/api/orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(
    private readonly commandDispatcher: SyncCommandDispatcher,
    private readonly orderRepository: OrderRepository,
  ) {}

  @Post()
  async createOrder(
    @Usr() user: User,
    @Body() orderRequest: OrderRequest,
  ) {
    const start = new Date().valueOf();
    console.log(user);

    const createOrder: CreateOrder = new CreateOrder(
      orderRequest.productId,
      orderRequest.productQuantity,
      user.username,
    );
    await this.commandDispatcher.execute(createOrder);
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();

    return null;
  }

  @Get()
  async getOrders(
    @Query() query: PaginatedOrderQuery,
  ) {
    const start = new Date().valueOf();
    // return this.orderRepository
    //   .where({ id: query.id })
    //   .relation(query.relations)
    //   .paginate(query.page, query.perPage);
    const orders = await this.orderRepository
      .where({ id: query.id })
      .relation(query.relations)
      .paginate(query.page, query.perPage);
    const end = new Date().valueOf() - start;
    histogram.observe(end/1000);
    counter.inc();
    return orders;
  }
}

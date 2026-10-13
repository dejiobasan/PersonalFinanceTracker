import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorResponseDto } from 'src/common/dtos/errorRes.dto';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from 'src/auth/guard/role.guard';
import { TransactionService } from './transaction.service';
import {
  AdminTransactionQueryDto,
  CreateTransactionDto,
  DeleteAllTransactionsResponseDto,
  DeleteTransactionResponseDto,
  PaginationQueryDto,
  TransactionListResponseDto,
  TransactionResponseDto,
  UpdateTransactionDto,
} from './dto';

type AuthRequest = Request & { user: { userId: string; role?: string } };

@ApiTags('transaction')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get all transactions (admin)',
    description:
      'Admin only. Paginated list of all transactions, searchable by user name and filterable by type.',
  })
  @ApiOkResponse({ type: TransactionListResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getAllTransactions(@Query() query: AdminTransactionQueryDto) {
    return this.transactionService.getAllTransactions(query);
  }

  @Delete('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Delete all transactions (admin)',
    description: 'Admin only. Permanently deletes every transaction.',
  })
  @ApiOkResponse({ type: DeleteAllTransactionsResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async deleteAllTransactions() {
    return this.transactionService.deleteAllTransactions();
  }

  @Get()
  @ApiOperation({
    summary: 'Get my transactions',
    description:
      "Paginated list of the logged in user's transactions, filterable by type.",
  })
  @ApiOkResponse({ type: TransactionListResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getUserTransactions(
    @Req() req: AuthRequest,
    @Query() query: PaginationQueryDto,
  ) {
    return this.transactionService.getUserTransactions(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get my transaction by id',
    description: "Get one of the logged in user's transactions by id.",
  })
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getUserTransactionById(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.transactionService.getUserTransactionById(req.user.userId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add a transaction',
    description: 'Create a transaction for the logged in user.',
  })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async createTransaction(
    @Req() req: AuthRequest,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(req.user.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update my transaction',
    description: "Partially update one of the logged in user's transactions.",
  })
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateTransaction(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete my transaction',
    description: "Delete one of the logged in user's transactions.",
  })
  @ApiOkResponse({ type: DeleteTransactionResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async deleteTransaction(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.transactionService.deleteTransaction(req.user.userId, id);
  }
}

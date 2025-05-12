import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import FilterDto from '@app/contracts/models/dtos/filterDto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseGuards(new JwtAuthGuard(['admin']))
    async add(@Req() req, @Body() product) {
        return await this.productService.add(product, req.user['sub'])
    }

    @Get()
    @UseGuards(new JwtAuthGuard(['admin']))
    async getList(@Query() filter: FilterDto) {
        return await this.productService.getList(filter)
    }
}

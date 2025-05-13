import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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

    @Delete(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async delete(@Param('id') id: string) {
        return await this.productService.delete(id)
    }

    @Put(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async update(@Param('id') id: string, @Body() product) {
        return await this.productService.update(id, product)
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async get(@Param('id') id: string) {
        return await this.productService.get(id)
    }
}

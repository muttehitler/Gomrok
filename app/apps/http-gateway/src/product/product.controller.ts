import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseGuards(new JwtAuthGuard(['admin']))
    async add(@Req() req, @Body() product) {
        return await this.productService.add(product, req.user['sub'])
    }
}

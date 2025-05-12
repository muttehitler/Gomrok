import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import ProductDto from '@app/contracts/models/dtos/product/productDto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern(PRODUCT_PATTERNS.ADD)
  async add(data: { product: ProductDto, authorId: string }) {
    return await this.productService.add(data.product, data.authorId)
  }
}

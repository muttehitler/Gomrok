import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern(PRODUCT_PATTERNS.ADD)
  async add(data: { product: ProductDto, authorId: string }) {
    return await this.productService.add(data.product, data.authorId)
  }

  @MessagePattern(PRODUCT_PATTERNS.GET_LIST)
  async getList(filter: FilterDto) {
    return await this.productService.getList(filter)
  }
}

import FilterDto from '@app/contracts/models/dtos/filterDto';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
    constructor(@Inject(PRODUCT_PATTERNS.CLIENT) private productClient: ClientProxy) { }

    async add(product: ProductDto, authorId: string) {
        return await this.productClient.send(PRODUCT_PATTERNS.ADD, { product: product, authorId: authorId })
    }

    async getList(filter: FilterDto) {
        return await this.productClient.send(PRODUCT_PATTERNS.GET_LIST, filter)
    }

    async delete(id: string) {
        return await this.productClient.send(PRODUCT_PATTERNS.DELETE, id)
    }
}

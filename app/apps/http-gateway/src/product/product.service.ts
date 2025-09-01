import FilterDto from '@app/contracts/models/dtos/filterDto';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_PATTERNS.CLIENT) private productClient: ClientProxy,
        @Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy,
        @Inject(REPORTING_PATTERNS.CLIENT) private reportingClient: ClientProxy,
    ) { }

    async add(product: ProductDto, authorId: string) {
        const result = await this.productClient.send(PRODUCT_PATTERNS.ADD, { product: product, authorId: authorId }).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.NEW_PRODUCT, { product, author: author.data });
        }
        return result;
    }

    async getList(filter: FilterDto) {
        return await this.productClient.send(PRODUCT_PATTERNS.GET_LIST, filter)
    }

    async delete(id: string, authorId: string) {
        const product = await this.get(id);
        const result = await this.productClient.send(PRODUCT_PATTERNS.DELETE, id).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.DELETE_PRODUCT, { product, author: author.data });
        }
        return result;
    }

    async update(id: string, product: ProductDto, authorId: string) {
        const result = await this.productClient.send(PRODUCT_PATTERNS.UPDATE, { id: id, product: product }).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.EDIT_PRODUCT, { product, author: author.data });
        }
        return result;
    }

    async get(id: string) {
        return await this.productClient.send(PRODUCT_PATTERNS.GET, id)
    }

    async getByPanel(filter: FilterDto, panelId: string) {
        return await this.productClient.send(PRODUCT_PATTERNS.GET_BY_PANEL, { filter: filter, panelId: panelId })
    }


    async getTestByPanel(id: string) {
        return await this.productClient.send(PRODUCT_PATTERNS.GET_TEST_BY_PANEL, id)
    }
}
import { BadRequestException, Injectable } from '@nestjs/common';
import Product, { ProductDocument } from './models/concrete/product';
import { Model, Types } from 'mongoose';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import { Messages } from '@app/contracts/messages/messages';
import generateRandomId from '@app/contracts/utils/random/randomString';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

  async add(product: ProductDto, authorId: string): Promise<ResultDto> {
    if (await this.productModel.findOne({ name: product.name }))
      throw new BadRequestException({
        message: Messages.PRODUCT.PRODUCT_IS_EXIST.message
      })
    const model = new this.productModel({
      name: product.name,
      panel: new Types.ObjectId(product.panel),
      payAsYouGo: product.payAsYouGo,
      usageDuration: product.usageDuration,
      dataLimit: product.dataLimit,
      userLimit: product.userLimit,
      onHold: product.onHold,
      price: product.price,
      weight: product.weight,
      productCode: generateRandomId(4)
    })
    await model.save()

    return {
      success: true,
      message: Messages.PRODUCT.PRODUCT_ADDED_SUCCESSFULLY.message,
      statusCode: Messages.PRODUCT.PRODUCT_ADDED_SUCCESSFULLY.code
    }
  }
}

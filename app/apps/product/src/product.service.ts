import { BadRequestException, Injectable } from '@nestjs/common';
import Product, { ProductDocument } from './models/concrete/product';
import { Model, Types } from 'mongoose';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import { Messages } from '@app/contracts/messages/messages';
import generateRandomId from '@app/contracts/utils/random/randomString';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';

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

  async getList({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<ProductDto[]>>> {
    const query = this.productModel.find({ status: true })
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<ProductDto>(x => {
      return {
        id: String(x._id),
        name: x.name,
        panel: String(x.panel),
        payAsYouGo: x.payAsYouGo,
        usageDuration: x.usageDuration,
        dataLimit: x.dataLimit,
        userLimit: x.userLimit,
        onHold: x.onHold,
        price: x.price,
        weight: x.weight,
        code: x.code
      }
    })

    return {
      success: true,
      message: Messages.PRODUCT.PRODUCT_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.PRODUCT.PRODUCT_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.productModel.find({ status: true })).length
      }
    }
  }

  async delete(id: string): Promise<ResultDto> {
    await this.productModel.deleteOne({ _id: new Types.ObjectId(id) })
    return {
      success: true,
      message: Messages.PRODUCT.PRODUCT_DELETED_SUCCESSFULLY.message,
      statusCode: Messages.PRODUCT.PRODUCT_DELETED_SUCCESSFULLY.code
    }
  }

  async update(id: string, product: ProductDto): Promise<ResultDto> {
    const p = await this.productModel.updateOne({ _id: id }, {
      $set: {
        name: product.name,
        panel: product.panel,
        payAsYouGo: product.payAsYouGo,
        usageDuration: product.usageDuration,
        dataLimit: product.dataLimit,
        userLimit: product.userLimit,
        onHold: product.onHold,
        price: product.price,
        code: product.code,
        weight: product.weight
      }
    })
    return {
      success: true,
      message: Messages.PRODUCT.PRODUCT_UPDATED_SUCCESSFULLY.message,
      statusCode: Messages.PRODUCT.PRODUCT_UPDATED_SUCCESSFULLY.code
    }
  }
}

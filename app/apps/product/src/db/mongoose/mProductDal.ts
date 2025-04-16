import MEntityRepository from "@app/contracts/db/contract/mEntityRepository";
import Product from "../../models/concrete/product";
import ProductDal from "../abstract/productDal";
import { productModel } from "./context/mongooseContext";

export default class MProductDal extends MEntityRepository<Product> implements ProductDal {
    constructor() {
        super(productModel)
    }
}
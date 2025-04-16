import EntityRepository from "@app/contracts/db/abstract/entityRepository";
import Product from "../../models/concrete/product";

export default abstract class ProductDal extends EntityRepository<Product> {

}
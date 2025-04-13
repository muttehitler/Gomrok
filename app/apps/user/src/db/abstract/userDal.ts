import EntityRepository from "@app/contracts/db/abstract/entityRepository";
import User from "../../concrete/user";

export default abstract class UserDal extends EntityRepository<User> {

}

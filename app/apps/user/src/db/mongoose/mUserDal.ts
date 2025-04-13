import { Injectable } from "@nestjs/common";
import User from "../../concrete/user";
import MEntityRepository from "../../../../../libs/contracts/src/db/contract/mEntityRepository";
import UserDal from "../abstract/userDal";
import { userModel } from "./context/mongooseContext";

@Injectable()
export default class MUserDal extends MEntityRepository<User> implements UserDal {
    constructor() {
        super(userModel)
    }
}
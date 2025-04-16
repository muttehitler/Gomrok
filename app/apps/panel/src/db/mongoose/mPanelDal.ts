import MEntityRepository from "@app/contracts/db/contract/mEntityRepository";
import panelDal from "../abstract/panelDal";
import Panel from "../../models/concrete/panel";
import { panelModel } from "./context/mongooseContext";

export default class MPanelDal extends MEntityRepository<Panel> implements panelDal {
    constructor() {
        super(panelModel)
    }
} 
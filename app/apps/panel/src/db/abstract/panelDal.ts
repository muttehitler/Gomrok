import EntityRepository from "@app/contracts/db/abstract/entityRepository";
import Panel from "../../models/concrete/panel";

export default abstract class panelDal extends EntityRepository<Panel> {

}
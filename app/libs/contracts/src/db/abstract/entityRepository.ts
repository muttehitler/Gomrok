import { RootFilterQuery, UpdateWithAggregationPipeline, UpdateQuery } from "mongoose";
import IEntity from '@app/contracts/models/abstract/iEntity'

abstract class EntityRepository<T extends IEntity> {
    abstract find(filter: RootFilterQuery<T>): Promise<T[]>
    abstract findOne(filter?: RootFilterQuery<T> | undefined): Promise<T | null>
    abstract findById(id: any): Promise<T | null>
    abstract add(entity: T): Promise<void>
    abstract deleteOne(filter?: RootFilterQuery<T> | undefined): Promise<void>
    abstract updateOne(filter: RootFilterQuery<T>, update: UpdateWithAggregationPipeline | UpdateQuery<T>): Promise<void>
}

export default EntityRepository
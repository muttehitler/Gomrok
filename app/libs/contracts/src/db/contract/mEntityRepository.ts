import mongoose, { RootFilterQuery, Types, Document } from "mongoose";
import IEntity from '@app/contracts/models/abstract/iEntity';
import EntityRepository from '@app/contracts/db/abstract/entityRepository';

class MEntityRepository<TEntity extends IEntity> implements EntityRepository<TEntity> {
    model: mongoose.Model<TEntity>

    constructor(model: mongoose.Model<TEntity>) {
        this.model = model
    }

    async updateOne(filter: RootFilterQuery<TEntity>, update: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<TEntity>): Promise<void> {
        await this.model.updateOne(filter, update)
    }
    async deleteOne(filter?: RootFilterQuery<TEntity> | undefined): Promise<void> {
        await this.model.deleteOne(filter)
    }
    async add(entity: TEntity): Promise<void> {
        let result = await this.model.create(entity);
        result.save()
    }
    async find(filter: mongoose.RootFilterQuery<TEntity>): Promise<TEntity[]> {
        return await this.model.find(filter)
    }
    async findOne(filter?: RootFilterQuery<TEntity> | undefined): Promise<TEntity | null> {
        return await this.model.findOne(filter)
    }
    async findById(id: any): Promise<TEntity | null> {
        return await this.model.findById(id)
    }

}

export default MEntityRepository
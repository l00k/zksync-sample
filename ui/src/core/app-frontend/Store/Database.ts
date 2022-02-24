import { App } from '../App';
import { StoreManager } from './StoreManager';
import { StorageModelClass } from './def';
import { ObjectManager } from '@inti5/object-manager';
import { v4 as uuid } from 'uuid';
import Vue from 'vue';
import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';


type Tables = {
    [modelName : string] : Object[]
}

type Payload = {
    model : StorageModelClass,
    object? : Object,
}


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Database'),
    namespaced: true,
    name: 'Database',
})
export class Database
    extends VuexModule<Database>
{

    public tables : Tables = {};

    public get findAll()
    {
        return (model : StorageModelClass) => {
            return this.tables[model.STORAGE_MODEL] || [];
        }
    }

    public get findOne()
    {
        return (model : StorageModelClass, uuid : string) => {
            return this.tables[model.STORAGE_MODEL]
                ? this.tables[model.STORAGE_MODEL].find(object => object['@uuid'] === uuid)
                : null;
        }
    }

    @Mutation
    public async persist({ model, object } : Payload)
    {
        if (!this.tables[model.STORAGE_MODEL]) {
            this.tables[model.STORAGE_MODEL] = [];
        }

        const table = this.tables[model.STORAGE_MODEL];

        if (!object['@uuid']) {
            object['@uuid'] = uuid();
        }

        const existing = table.find(_object => _object['@uuid'] === object['@uuid']);
        if (existing) {
            Object.assign(existing, object);
        }
        else {
            table.push(object);
        }
    }

    @Mutation
    public async delete({ model, object } : Payload)
    {
        const table = this.tables[model.STORAGE_MODEL];
        if (!table) {
            return;
        }

        const found = table.findIndex(_object => _object['@uuid'] === object['@uuid']);
        if (found !== -1) {
            this.tables[model.STORAGE_MODEL].splice(found, 1);
        }
    }

    @Mutation
    public async truncate({ model } : Payload)
    {
        this.tables[model.STORAGE_MODEL] = [];
    }

}

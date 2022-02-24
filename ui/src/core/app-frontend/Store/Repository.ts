import { App } from '../App';
import { EventBus } from '@inti5/event-bus';
import { ObjectManager } from '@inti5/object-manager/index';
import { Store as VuexStore } from 'vuex';


export class Repository<T>
{

    protected eventBus : EventBus;

    protected store : VuexStore<any>;

    protected model : Object;

    protected constructor(model : Object)
    {
        const objectManager = ObjectManager.getSingleton();
        this.eventBus = objectManager.getInstance(EventBus);
        this.store = objectManager.getInstance(App).getVuexStore();
        this.model = model;
    }

    public static get(model : Object) : Repository<any>
    {
        return new Repository(model);
    }

    public findAll<T>() : T[]
    {
        return this.store.getters['Database/findAll'](this.model);
    }

    public findOne<T>(id : string) : T
    {
        return this.store.getters['Database/findAll'](this.model, id);
    }

    public persist<T>(object : T) : void
    {
        this.store.commit('Database/persist', { model: this.model, object });
        this.eventBus.emit('database:update', { model: this.model, object });
    }

    public delete<T>(object : T) : void
    {
        this.store.commit('Database/delete', { model: this.model, object });
        this.eventBus.emit('database:delete', { model: this.model, object });
    }

    public truncate() : void
    {
        this.store.commit('Database/truncate', { model: this.model });
        this.eventBus.emit('database:delete', { model: this.model });
    }

}

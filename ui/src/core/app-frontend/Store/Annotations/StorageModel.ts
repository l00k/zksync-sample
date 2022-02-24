import { StoreManager } from '../StoreManager';


export function StorageModel(modelName : string) : ClassDecorator {
    return (Target : any) => {
        Target.STORAGE_MODEL = modelName;
        StoreManager.registerModel(modelName, Target);
    };
}

export function Timeout (timeout : number) : MethodDecorator
{
    return (Target : any, method : string | symbol, descriptor : PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args : any[]) {
            return new Promise(async(resolve, reject) => {
                setTimeout(() => reject('Timeout'), timeout);
                
                try {
                    const result = await originalMethod.apply(this, args);
                    resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
    };
}

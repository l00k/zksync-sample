import Vue, { Component } from 'vue';
import { RouteConfig } from 'vue-router';
import { ObjectManager } from '@inti5/object-manager';
import { App } from '../../App';


const specialMethodsToHandle = [
    'beforeRouteLeave',
    'beforeRouteUpdate',
    'beforeRouteEnter'
];


export function Route(path : string, name : string, options : Partial<RouteConfig> = {}) : ClassDecorator
{
    return (Target : any) => {
        const vueRouter = ObjectManager.getSingleton()
            .getInstance(App)
            .getVueRouter();
    
        const route : RouteConfig = {
            path,
            name,
            component: Target,
            ...options
        };
        
        const routes = vueRouter.getRoutes();
        const exist = routes.find(_route => _route.path == route.path);
        if (!exist) {
            vueRouter.addRoute(route);
        }
    };
}

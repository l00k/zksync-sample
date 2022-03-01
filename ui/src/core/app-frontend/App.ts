import * as Api from '@inti5/api-frontend';
import { Configuration } from '@inti5/configuration';
import { EventBus } from '@inti5/event-bus';
import { Inject, ObjectManager, Singleton } from '@inti5/object-manager';
import { Logger } from '@inti5/utils/Logger';
import { ModuleLoader } from '@inti5/webpack-loader/ModuleLoader';
import { ServiceLoader } from '@inti5/webpack-loader/ServiceLoader';
import isEmpty from 'lodash/isEmpty';
import Vue from 'vue';
import { $internalHooks } from 'vue-class-component/lib/component';
import VueRouter from 'vue-router';
import Vuex, { Store as VuexStore } from 'vuex';
import AppComponent from './Component/AppComponent.vue';
import { StoreManager } from './Store/StoreManager';


@Singleton()
export class App
{
    
    protected configuration : Configuration;
    
    @Inject({ ctorArgs: [ 'App' ] })
    protected logger : Logger;
    
    @Inject()
    protected eventBus : EventBus;
    
    @Inject()
    protected moduleLoader : ModuleLoader;
    
    @Inject()
    protected serviceLoader : ServiceLoader;
    
    @Inject()
    protected api : Api.Service;
    
    
    protected vue : Vue;
    
    protected vuexStore : VuexStore<any>;
    
    protected vueRouter : VueRouter;
    
    
    public async run ()
    {
        // register hooks
        $internalHooks.push(
            'beforeRouteEnter',
            'beforeRouteUpdate',
            'beforeRouteLeave'
        );
        
        // load configuration
        await this.loadConfigData();
        
        // register configuration under object manager handlers
        ObjectManager.getSingleton()
            .registerHandler(this.configuration.injectConfigurationValues.bind(this.configuration));
        
        // load services
        await this.serviceLoader.load();
        
        // load routes and init router
        this.vueRouter = new VueRouter({
            mode: 'history',
            base: process.env.BASE_URL,
        });
        
        // load models
        await this.moduleLoader.loadComponents([ 'Domain/Model' ]);
        
        // setup store and database
        this.vuexStore = new Vuex.Store({
            plugins: [
                StoreManager.getVuexPersister,
            ]
        });
        
        await import('./Store/Database');
        
        // load other modules components
        await this.moduleLoader.loadComponents([ 'Observer', 'Page', 'Store' ]);
        
        // boostrap api
        this.api.bootstrap();
        
        // load Vue exts
        await this.loadVueExts();
        
        // init app
        const appComponent : typeof AppComponent = this.configuration.get('core.layout.appComponent', AppComponent);
        this.vue = new Vue({
            router: this.vueRouter,
            store: this.vuexStore,
            render: h => h(appComponent),
        });
        
        await this.vue.$mount('#app');
    }
    
    public getVueRouter () : VueRouter
    {
        return this.vueRouter;
    }
    
    public getVuexStore () : VuexStore<any>
    {
        return this.vuexStore;
    }
    
    protected async loadVueExts ()
    {
        // from main
        require('./Vue/ExtPackage');
        
        // from modules
        const vueModuleExts = await this.moduleLoader.loadComponents([ 'Vue' ]);
    }
    
    protected async loadConfigData ()
    {
        this.configuration = Configuration.getSingleton();
        
        // per module configuration
        const moduleConfigPackages = await this.moduleLoader.loadFilePerModule('etc/config');
        
        Object.entries(moduleConfigPackages)
            .forEach(([ moduleName, moduleConfigPackage ]) => {
                const configData = (<any>moduleConfigPackage).default;
                this.configuration.load(configData);
            });
        
        // global configuration
        {
            const configData = require('@/etc/config.ts').default;
            this.configuration
                .load(configData);
        }
        
        // global development configuration
        const env = process.env.NODE_ENV || 'production';
        const isDev = env !== 'production';
        
        if (isDev) {
            this.logger.log('Loading deployment configuration');
            
            const configData = require('@/etc/local/config.ts').default;
            this.configuration.load(configData);
        }
    }
    
}

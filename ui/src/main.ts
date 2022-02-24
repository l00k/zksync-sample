import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import Buefy from 'buefy';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VTooltip from 'v-tooltip';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Buefy, {
    defaultIconPack: 'fas',
});

Vue.use(VTooltip);

(async () => {
    const objectManager = ObjectManager.getSingleton();
    const app = objectManager.getInstance(App);
    await app.run();
})();

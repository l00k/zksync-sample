import { Jdenticon, TxHandler } from '#/App/Component';
import * as Utility from '#/App/Utility';
import Decimal from 'decimal.js';
import numbro from 'numbro';
import Vue from 'vue';


Vue.component('Jdenticon', Jdenticon);
Vue.component('TxHandler', TxHandler);

Vue.filter('formatNumber', Utility.formatNumber);
Vue.filter('formatPercent', Utility.formatPercent);
Vue.filter('parseRawCoin', Utility.parseRawCoin);
Vue.filter('formatCoin', Utility.formatCoin);
Vue.filter('unformatCoin', Utility.unformatCoin);
Vue.filter('formatAddress', Utility.formatAddress);
Vue.filter('formatPublicKey', Utility.formatPublicKey);

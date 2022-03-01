import moment from 'moment';
import numbro from 'numbro';
import Vue from 'vue';
import { debounce } from 'vue-debounce';


Vue.filter('consoleLog', function() {
    console.log(...arguments);
});

Vue.filter('stringify', function(value : any) {
    return JSON.stringify(value);
});

Vue.filter('ucfirst', function(str : string) {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
});

Vue.filter('formatNumber', function(number : number, format) {
    return numbro(number).format(format);
});

Vue.filter('formatDate', function(date : Date) {
    return moment(date).format('YYYY-MM-DD');
});

Vue.filter('formatTime', function(date : Date) {
    return moment(date).format('HH:mm:ss');
});

Vue.filter('formatDatetime', function(date : Date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
});

Vue.filter('debounce', function(callee : any, delay : number = 300) {
    return debounce(callee, delay);
});

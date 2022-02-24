import moment from 'moment';
import numbro from 'numbro';
import { debounce } from 'vue-debounce';

export default {
    consoleLog() {
        console.log(...arguments);
    },
    
    stringify(value : any) {
        return JSON.stringify(value);
    },

    ucfirst(str : string)
    {
        return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    },

    formatNumber(number : number, format)
    {
        return numbro(number).format(format);
    },

    formatDate(date : Date)
    {
        return moment(date).format('YYYY-MM-DD');
    },

    formatTime(date : Date)
    {
        return moment(date).format('HH:mm:ss');
    },

    formatDatetime(date : Date)
    {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },

    debounce(callee : any, delay : number = 300)
    {
        return debounce(callee, delay);
    }
};

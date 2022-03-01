import Vue from 'vue';
import { getDirective } from 'vue-debounce';

Vue.directive('debounce', getDirective());

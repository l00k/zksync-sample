import Vue from 'vue';

// Icons
Vue.component('FaIcon', require('@fortawesome/vue-fontawesome').FontAwesomeIcon);

// Buefy fix
Vue.component('BTable', require('@inti5/app-frontend/Component/Buefy/Table').default);
Vue.component('BTableColumn', require('@inti5/app-frontend/Component/Buefy/TableColumn').default);

// Validator
Vue.component('ValidationProvider', require('vee-validate').ValidationProvider);
Vue.component('ValidationObserver', require('vee-validate').ValidationObserver);

// UI
Vue.component('BaseComponent', require('@inti5/app-frontend/Component/BaseComponent.vue').default);

Vue.component('UiModal', require('@inti5/app-frontend/Component/UI/Modal.vue').default);
Vue.component('UiBlock', require('@inti5/app-frontend/Component/UI/Block.vue').default);
Vue.component('UiBlockCollapsable', require('@inti5/app-frontend/Component/UI/BlockCollapsable.vue').default);

Vue.component('UiTable', require('@inti5/app-frontend/Component/UI/Table/Table.vue').default);
Vue.component('UiTableColumn', require('@inti5/app-frontend/Component/UI/Table/TableColumn.vue').default);

Vue.component('UiFilterBase', require('@inti5/app-frontend/Component/UI/FilterField/FilterBase.vue').default);
Vue.component('UiFilterRange', require('@inti5/app-frontend/Component/UI/FilterField/FilterRange.vue').default);
Vue.component('UiFilterSelect', require('@inti5/app-frontend/Component/UI/FilterField/FilterSelect.vue').default);
Vue.component('UiFilterText', require('@inti5/app-frontend/Component/UI/FilterField/FilterText.vue').default);

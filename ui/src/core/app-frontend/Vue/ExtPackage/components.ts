export default {
    // Icons
    'fa-icon': require('@fortawesome/vue-fontawesome').FontAwesomeIcon,
    
    // Buefy fix
    'b-table': require('../../Component/Buefy/Table').default,
    'b-table-column': require('../../Component/Buefy/TableColumn').default,
    
    // UI
    'ui-block': require('../../Component/UI/Block').default,
    
    'ui-filter-range': require('../../Component/UI/FilterField/FilterRange').default,
    'ui-filter-text': require('../../Component/UI/FilterField/FilterText').default,
    'ui-filter-select': require('../../Component/UI/FilterField/FilterSelect').default,
    
    'ui-table': require('../../Component/UI/Table/Table').default,
    'ui-table-column': require('../../Component/UI/Table/TableColumn').default,
    
    'ui-modal': require('../../Component/UI/Modal').default,
    
    // Validator
    'validate-provider': require('vee-validate').ValidationProvider,
    'validate-observer': require('vee-validate').ValidationObserver,
};



require('./bootstrap');

/** Form helper **/
import Form from './utils/Form/Form';
window.Form=Form;

//....

Vue.component('logintest', require('./components/loginTest.vue'));

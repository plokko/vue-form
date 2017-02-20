
/** boostrapping (Laravel) **/
require('./bootstrap');

/** include the Form helper, replace with your path! **/
import Form from './utils/Form/Form';
window.Form=Form;

/** Include example Vue component **/

Vue.component('loginexample', require('./components/loginexample.vue'));
# vue-form
Form helper for Vue.js with integrated frontend field validation

Inspired by: https://laracasts.com/series/learn-vue-2-step-by-step/episodes/19
## How to use it:

Copy **src/Form/*** in your local js source folder, for example (Laravel 5.4) **/resources/assets/js/utils/Form**


Include the Form class in your **app.js** file
```javascript
//.....require('./bootstrap');....//
/** Form helper **/
import Form from './utils/Form/Form';
window.Form=Form;
//....
```

Use it in your Vue.js components like in laracast example:
```html
<script>

    export default{
        data(){
            return{
                form:new Form({
                                email:'',
                                password:'',
                            })
            }
        },
        methods:{

            login()
            {
                this.form.post('/login')
                    .then(r=>{console.info('!!login success!')})
                    .catch(e=>{console.error('!!login error!')});
            },
            reset()
            {
                this.form.reset();
            },
        },
    }
</script>
```
Remember to bind the instace proprieties on your component like so:
```html
<input type=email v-model="form.email" class="form-control" >
```

see examples/logintest.vue for a complete example.

###Add frontend validation rules to the form:
This library includes a fronted (javascript check, before actually submitting the form) input validation like the Laravel validate;
to use it just pass it on the options like so:


```javascript
let form=new Form({
                email:'',
                password:'',
            },{
              validate:{
                email:'required|email',
                password:'required|min:4'
              }
            });
```
The rules, if present, will be valdiate before submitting the form or via the validate function.
The validate function will return ```true``` if all the validation rules succeeded, an Error object if failed.
You can validate one field simply by specify it in the vlaidate function (ex: form.validate('email') ).
The submit function will always return a Promise; if the validation fails it will return an Error object as result.


#Validator
The Validator class handles front-end validation of fields

```javascript
let objectTovalidate={email:'wrongEmail@.address','password':'thisPasswordIsAccettable'},
    rulesToVerify={email:'required|email',password:'required|min:4'};
let validator=new Validator(objectTovalidate,rulesToVerify);
console.info(validator.validate());
```
The validate function will return true on success or an object containing all error messages on fails;
in this example the error would be:

```javascript
{
 email:['The email field is not a valid email value!']
}
```

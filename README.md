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

##Adding new validation rules
The validator class could be expanded adding new validation rules via the static method *Validator.registerNewRule(ruleName,handler,message)*:
```javascript
import Validator from './utils/Form/Validator';
//....define the new rule:
Validator.registerNewRule('isjojofamily',//Name of the rule
                            (string)=>string.match(/(^jo\w+ jo\w+$|^gio\w+ gio\w+$)/i) ,//test the rule (true|false)
                            (o)=>`'${o.field.value}' is not of the Jojo family tree!`
                        );
                        
Validator.registerNewRule('sdcatchphrase',//Name of the rule
                            (string,n)=>string.match(new RegExp('^u(ra){'+n+',}','i')) ,// 'u' + at least N 'ra' repetitions
                            (o)=>`${o.field.name} is not a valid Shining Diamond catchphrase!`
                        );
//....using the new rule...//
let v=new Validator({name:'Dio Brando',catchphrase:'mudamudamuda'},{name:'required|isjojofamily',catchphrase:'sdcatchphrase'});//obviusly it will fail
console.log(v.validate());
//..
```
The rule accepts 3 arguments:

1. **ruleName** ```string``` name of the rule (required and unique, duplicate rules will be overwritten)
2. **handler** ```function(FieldValue[,ruleValue])``` a function that will test the rule, must return true on success or false on failure. 
    The arguments passed are the field value as first paramenter and the optional rule value if present (ex.: in 'min:3' the rule value is '3', remember to cast it from string!)
3. **message** ```function|string|undefined``` optional string to display on rule failure, if function is used the parameters passed will be: 
    ```javascript
{field:{name:'field name',value:'field value'},rule:{name:'rule name',value:'optional rule value'}}
```.

Like in the previus example the rules could also be registered via the **registerRules** method that will reset all the existing rules and use the newly specified ones and it's also used to register default validation rules.

This function support 3 notations:

```javascript
/** Register default validation rules **/
Validator.registerRules({
    /** Array notation **/
    required:[
        (str)=> str.trim().length>0,//First parameter is the handler
        o => `The  '${o.field.name}' field is required`//second parameter is the message (optional,string or function)
    ],
    /** Object notation **/
    email:{
        handler(str,v)//Handler function
        {
            return str.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
        },
        message(o){return `The ${o.field.name} field is not a valid email value!`;}//optional message function|string
    },
    /** "Simple function" notation **/
    min(str,v){//Just an handler function, message is not specified
        return str.length>=parseInt(v);
    },
    max(str,v){
        return str.length<=parseInt(v);
    }
});
```

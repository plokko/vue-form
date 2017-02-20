class Validator
{
    /**
     * Class constructor
     * @param el object Object to validate
     * @param rules object Rules to validate (ex. {email:['required','email'] )
     */
    constructor(el,rules)
    {

        // Process rules //
        for(let k in rules)
        {
            if(typeof rules[k] == 'string')
                rules[k]=rules[k].split('|')
                                    .map( s=> s.split(':') );
        }
        //

        Object.assign(this,{el,rules});
    }

    validate(field)
    {
        let errors={};
        for(let fieldName of (field? [field] : Object.keys(this.rules)))
        {
            // Check all the field rules //
            for(let [ruleName,ruleValue] of this.rules[fieldName])
            {

                var r=Validator.checkRule(this.el,fieldName,ruleName,ruleValue)
                if(r!==true)
                    (errors[fieldName]=errors[fieldName]||[]).push(r);
            }
        }

        return Object.keys(errors).length>0?
                    errors:
                    true;
    }

    /**
     * Register (static,global) a new validation rule
     * @param ruleName string Rule name
     * @param handler function Function to test the rule (returns true|false)
     * @param message function|string|undefined Error message or function to build the message
     */
    static registerNewRule(ruleName,handler,message=(o)=>`The field ${o.field.name} did not match ${o.rule.name} rule!`)
    {
        this.validators[ruleName]={handler,message};
    }

    static registerRuleMessage(ruleName,message)
    {
        if(!this.validators[ruleName])
            throw `${ruleName} not found!`;
        this.validators[ruleName].message=message;
    }

    static registerRules(rules)
    {
        this.validators={};

        for(let ruleName in rules)
        {
            let v=rules[ruleName];
            let [handler,message]=(Array.isArray(v))?
                v:
                ((typeof(v)=='function')?
                        [v,undefined]:
                        [v.handler,v.message]
                );
            this.registerNewRule(ruleName,handler,message);
        }
    }

    static checkRule(obj,fieldName,ruleName,ruleValue)
    {
        let fieldValue=obj[fieldName];
        console.log('static validators',this.validators);

        let validator=this.validators[ruleName];
        if(validator===undefined)
            throw {name:'ruleNotFound',field:fieldName,rule:ruleName};

        if(!validator.handler(fieldValue,ruleValue))
            return (typeof validator.message=='string')?
                    validator.message :
                    validator.message({
                        field:{name:fieldName,value:fieldValue},
                        rule:{name:ruleName,value:ruleValue}
                    });
        return true;
    }
}

/** Register default validation rules **/
Validator.registerRules({
    /** Array notation **/
    required:[
        (str)=> str.trim().length>0,
        o => `The  '${o.field.name}' field is required`
    ],
    /** Object notation **/
    email:{
        handler(str,v){
            return str.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
        },
        message(o){return `The ${o.field.name} field is not a valid email value!`;}
    },
    /** "Simple function" notation **/
    min(str,v){
        return str.length>=parseInt(v);
    },
    max(str,v){
        return str.length<=parseInt(v);
    }
});

export default Validator;
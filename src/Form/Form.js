import Errors from './Errors';
import Validator from './Validator';


class Form
{
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data,options={})
    {
        this.__ = {
            originalData:{},
            validator:null
        };
        Object.assign(this.__.originalData,data);

        for(let i in options)
        {
            switch(i)
            {
                case 'validate':
                case 'validator':
                    this.setValidationRules(options[i]);
                    break;
                default:
            }
        }

        Object.assign(this,data);

        this.errors = new Errors();
    }



    /**
     * Fetch all relevant data for the form.
     */
    getData()
    {
        let data = {};

        for (let field in this.__.originalData)
        {
            data[field] = this[field];
        }

        return data;
    }


    /**
     * Reset the form fields.
     */
    reset()
    {
        Object.assign(this,this.__.originalData);
        this.errors.clear();
    }


    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     */
    post(url)
    {
        return this.submit('post',url);
    }


    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url)
    {
        return this.submit('put', url);
    }


    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url)
    {
        return this.submit('patch', url);
    }


    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url)
    {
        return this.submit('delete', url);
    }


    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit(requestType='post', url='')
    {
        let v=this.validate();
        if(v!==true)
            return new Promise((resolve, reject) => {
                console.warn('pre-submit form validation failed!');
                reject(v);
            });

        return new Promise((resolve, reject) => {
            axios[requestType](url, this.getData())
                .then(response => {
                    this.onSuccess(response.data);

                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.response.data||error.response.data);

                    reject(error.response.data);
                });
        });
    }


    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     */
    onSuccess(data) 
    {
        console.info('form success!',data.message);
        this.reset();
    }


    /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     */
    onFail(errors)
    {
        this.errors.record(errors);
    }

    setValidationRules(rules)
    {
        this.__.validator=new Validator(this,rules);
    }

    validate()
    {
        let validator=this.__.validator;
        if(!validator)
            return true;

        let r=validator.validate();
        if(r===true)
            return true;

        this.errors.record(r);

        return r;
    }
}

export default Form;
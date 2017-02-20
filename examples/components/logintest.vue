<template>
    <div class="panel panel-primary">
        <div class="panel-heading">Test login</div>
        <div class="panel-body">
            <!-- email input group -->
            <div :class="{'form-group':true,'has-error':form.errors.has('email')}" v-if="isMailLogin">
                <label>User email</label>
                <input type=email v-model="form.email" class="form-control" placeholder="Email di login" required >
                <span class="help-block" v-if="form.errors.has('email')" v-text="form.errors.get('email')"></span>
            </div>
            <div :class="{'form-group':true,'has-error':form.errors.has('user')}" v-else>
                <label>Username</label>
                <input type=text v-model="form.user" class="form-control" placeholder="Username" required >
                <span class="help-block" v-if="form.errors.has('user')" v-text="form.errors.get('user')"></span>
            </div>

            <!-- password input group -->
            <div :class="{'form-group':true,'has-error':form.errors.has('password')}">
                <label>Password</label>
                <input type=password v-model="form.password" class="form-control" placeholder="Password" required>
                <span class="help-block" v-if="form.errors.has('password')" v-text="form.errors.get('password')"></span>
            </div>

        </div>
        <div class="panel-footer text-center">
            <button type=submit class="btn btn-primary" @click="login()"><i class="glyphicon glyphicon-send"></i> Login</button>
            <button type=button class="btn btn-danger" @click.prevent="reset()"><i class="glyphicon glyphicon-trash"></i> Reset</button>

        </div>
    </div>
</template>
<script>

    export default{
        props:{
            isMailLogin:{type:Boolean,default:true},
        },
        data(){
            return{
                form:new Form({
                                /** Field values: bind this to the fields **/
                                email:'',
                                user:'',
                                password:'',
                            },
                            {
                                /** Pre-submit validation rules **/
                                validate:{
                                    email:'required|email',
                                    password:'required|min:4'
                                }
                            }
                )
            }
        },
        computed:{

        },
        methods:{

            login()
            {
                //Send a post request to login//
                this.form.post('/login')
                    .then(r=>{alert('@login succeeded!')})
                    .catch(e=>{console.error('@login error!')});
            },
            reset()
            {
                this.form.reset();//Reset the form
            },
        },
    }
</script>

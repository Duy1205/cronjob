const fs = require('fs');
module.exports = {
    name : "helper",

    actions : {
        random() {
            return Math.round(Math.random() * 10)
        },
        age : {
            cache: {
                keys : ["title"]
            },
            params : {
                title : { type :"string" }
            },
            handler(ctx) {
                
                const gettitle = ctx.params.title;
                return `${Math.round(Math.random() * 100)}, ${gettitle}`
            }
        }, 
      
        eventLoopFunc() {

            console.log('this is the start');
            
            setTimeout(function cb() {
                console.log('Callback 1: this is a msg from call back');
            }); // has a default time value of 0
            
            console.log('this is just a message');
            
            setTimeout(function cb1() {
                console.log('Callback 2: this is a msg from call back');
            }, 0);
            
            console.log('this is the end');
            
            }
    },
        

    events : {

        
        "hello.called" (payload) {
            this.logger.info("Helper Service Caught and Event");
            this.logger.info(payload);
            return payload;
        },

        "messageSuccess" (payload){
            this.logger.info("This is messageSuccess events");
            this.logger.info(payload);
        },
        
        "create.name" (payload){
            this.logger.info("This is create.name events");
            this.logger.info(payload);
        },

        "list.user" (ctx){
            console.log("Payload:", ctx.params);
            console.log("Sender:", ctx.nodeID);
            console.log("Metadata:", ctx.meta);
            console.log("The called event name:", ctx.eventName);
        }
    },

    methods : {
        cleanEntities() {
            return this.actions.clean();
        }
    }
};
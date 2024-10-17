# integra-stripe-app


## mongo db setup 

### login to mongo

    mongo

    use admin

    use integra-stripe

    ### create a user

    db.createUser({
    user: "stripeUser",
    pwd: "stripe@4546",
    roles: [
        { role: "read", db: "integra-stripe" },
        { role: "readWrite", db: "integra-stripe" },
        { role: "dbAdmin", db: "integra-stripe" },
        { role: "dbOwner", db: "integra-stripe" },
        { role: "userAdmin", db: "integra-stripe" },    
    ]
    })

### mongo url  :- 
        mongodb://stripe:stripe123@#@172.212.91.246:27017/integra-stripe


## update user pwd
    db.updateUser("stripe", { pwd: "stripe123" })

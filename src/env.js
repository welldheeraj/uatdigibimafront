const constant = {
    USER:'',
    EMAIL_ID:'',
    COOKIE:{
        HEADER:'@#$%^AZ##'
    }
    ,ROUTES:{
        HEALTH:{
            'INDEX':'/health',
            'INSURE':'/health/insure',
            'ILLNESS':'/health/illness',
            'PLANS':'/health/plans',
            'CHECKOUT':'/health/checkout',
            'PROPOSAL':'/health/proposal',
            
        } ,
        MOTOR:{
             'LOGIN':'/motor',
             'SELECTVEHICLE':'/motor/common',
        },
        USER:{
            'PROFILE':'/userpnlx'
        }
    },
    API:{
       HEALTH:{
        'SENDOTP':'/api/sendotp',
        'VERIFYOTP':'/api/verifyotp',
        'PINCODE':'/api/acpincode',
        'INSUREVIEW':'/api/insureview',
        'GETINSURE':'/api/getinsureinfo',
        'ILLNESS':'/api/illnesses',
        'SAVEILLNESS':'/api/saveillnesses',
        'PLANDATA':'/api/quoteview',
        'FILTERPLAN':'/api/filterplan',
        'GETQUOTE':'/api/health-quotation-generate',
        'CHECKOUT':'/api/addon',
        'SETPREMIUM':'api/setpremium',
        'PlANCHECKOUT':'/api/plancheckout',
       } 
    }

};

export default constant;
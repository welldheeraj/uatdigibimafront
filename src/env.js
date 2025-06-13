const constant = {
    USER:'',
    EMAIL_ID:''
    ,ROUTES:{
        HEALTH:{
            'INDEX':'/health/',
            'INSURE':'/health/insure',
            'ILLNESS':'/health/illness',
            'PLANS':'/health/plans'
        } 
    },
    API:{
       HEALTH:{
        'SENDOTP':'/api/sendotp',
        'VERIFYOTP':'/api/verifyotp',
        'PINCODE':'/api/acpincode',
        'ILLNESS':'/api/illnesses',
        'SAVEILLNESS':'/api/saveillnesses',
        'INSUREVIEW':'/api/insureview',
        'GETINSURE':'/api/getinsureinfo'
       } 
    }
};

export default constant;
const constant = {
    USER:'',
    EMAIL_ID:''
    ,ROUTES:{
        HEALTH:{
            'INDEX':'/health',
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
        'INSUREVIEW':'/api/insureview',
        'GETINSURE':'/api/getinsureinfo',
        'ILLNESS':'/api/illnesses',
        'SAVEILLNESS':'/api/saveillnesses',
        'PLANDATA':'/api/quoteview',
        'GETQUOTE':'/api/health-quotation-generate',
       } 
    }
};

export default constant;
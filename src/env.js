const constant = {
    USER:'',
    EMAIL_ID:''
    ,ROUTES:{
        HEALTH:{
            'INSURE':'health/insure',
            'ILLNESS':'health/illness',
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
       } 
    }
};

export default constant;
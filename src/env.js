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
            'PLANS':'/health/plansOne',
            'CHECKOUT':'health/checkoutOne',
            'PROPOSAL':'/health/proposal',
            
        } ,
        MOTOR:{
             'INDEX':'/motor',
             'SELECTVEHICLE':'/motor/common',
             'KnowCarSlide2':'/motor/car/common/knowcarslide2',
             'KnowCarSlide3':'/motor/car/common/knowcarslide3'
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
        'ADDADDONS':'/api/addaddon',
       } ,

       MOTOR:{
        'LOGIN' : '/api/motor/vehicle-type-select',
        'VERIFYRTO' : '/api/motor/verifyrto'
       }
    }

};

export default constant;
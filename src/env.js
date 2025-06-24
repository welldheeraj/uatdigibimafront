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
            'PROPOSAL':'/health/journey',
            
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
        'PANVERIFY':'/api/verifypan',
        'AADHARVERIFY':'/api/verifyadhar',
        'SAVESTEPONE':'/api/proposalStepOne',
       } ,

       MOTOR:{
        'LOGIN' : '/api/motor/vehicle-type-select',
        'VERIFYRTO' : '/api/motor/verifyrto',
        'BRANDS' : '/api/motor/getbrand',
        'MODELS' : '/api/motor/getmodel',
        CAR:{
            'SAVESTEPONE':'/api/motor-car/kn-car-details',
            'SAVESTEPTWO':'/api/motor-car/kn-car-detailstwo'
        },
        'CARDETAILSTWO' : '/api/motor-car/kn-car-detailstwo'
       },
       USER:{
            'PROFILEUPDATE':'/api/userpnlx/user-profile-update'
       }
    }

};

export default constant;
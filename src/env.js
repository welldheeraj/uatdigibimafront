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

        'PANVERIFY':'/api/verifypan',
        'AADHARVERIFY':'/api/verifyadhar',
        'SAVESTEPONE':'/api/proposalStepOne',
        'SAVESTEPTWO':'/api/proposalStepTwo',
       } ,

       MOTOR:{
        'LOGIN' : '/api/motor/vehicle-type-select',
        'VERIFYRTO' : '/api/motor/verifyrto',
        'BRANDS' : '/api/motor/getbrand',
        'MODELS' : '/api/motor/getmodel'
       },
       USER:{
            'PROFILEUPDATE':'/api/userpnlx/user-profile-update'
       }
    },
     QUESTION: {
    CAREDISEASE: {
      '11': 'Cancer or Tumor of any kind?',
      '12': 'Any heart related or circulatory system disorders?',
      '13': 'Hypertension/High Blood Pressure/Cholesterol disorder?',
      '14': 'Breathing/Respiratory issues (E.g.TB, Asthma, etc.)?',
      '15': 'Endocrine disorders (E.g. Thyroid related disorders, etc)?',
      '16': 'Diabetes/High blood sugar?',
      '17': 'Muscles or Nervous system related disorder or Stroke/Epilepsy/Paralysis or other brain related disorders?',
      '18': 'Liver/gallbladder or any other Gastro-Intestinal Disease?',
      '19': 'Kidney failure/Stone/Dialysis/Gynaecological/Prostate disease?',
      '110': 'Auto-immune or Blood related disorders (Rheumatoid arthritis, Thalassemia, etc.)?',
      '111': 'Any Congenital Disorder?',
      '112': 'HIV/AIDS/STD?',
      '113': 'Any other disease/health adversity/injury/condition/treatment not mentioned above?',
      '114': 'Has any of the Proposed to be Insured consulted/taken treatment or been recommended to take investigations/medication/surgery other than for childbirth/minor injuries?',
      '115': 'Has any of the Proposed to be Insured been hospitalized or has been under any prolonged treatment for any illness/injury or has undergone surgery other than for childbirth/minor injuries?',
      '21': 'Has any of the new person(s) to be insured ever filed a claim with their current / previous insurer?',
      '22': 'Has any proposal for Health Insurance of the new person(s) to be insured, been declined, cancelled or charged a higher premium?',
      '23': 'Is any of the person(s) to be insured already covered under any other health insurance policy of Care Health Insurance?',
      '24': 'Already covered',
      '25': 'Have any of the above mentioned person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?'
    },
    LIFESTYLE: {
      '31': 'Personal habit of smoking/ alcohol/gutkha/ tobacco/paan?'
      // You can add more if needed
    }
  }

};

export default constant;
const constant = {
  USER: "",
  EMAIL_ID: "",
  COOKIE: {
    HEADER: "@#$%^AZ##",
  },
  ROUTES: {
    INDEX: "/",
    LOGIN: {
      HEALTHLOGIN: "/login?type=health",
      MOTORLOGIN: "/login?type=motor",
    },
    HEALTH: {
      // 'INDEX': '/health',
      INSURE: "/health/common/insure",
      ILLNESS: "/health/common/illness",
      PLANS: "/health/common/plans",

      CARESUPEREME: {
        CHECKOUT: "/health/vendors/caresupereme/checkout",
        PROPOSAL: "/health/vendors/caresupereme/journey",
        PAYMENT: "/health/payment",
      },

      ULTIMATECARE: {
        PROPOSAL: "/health/vendors/ultimatecare/journey",
        PAYMENT: "/health/payment",
      },

      VENDOR: {
        100: "/health/vendors/caresupereme/checkout",
        102: "/health/vendors/ultimatecare/checkout",
        101: "/health/vendors/Godigits/checkout",
      },
    },
    MOTOR: {
      // 'INDEX': '/motor',
      SELECTVEHICLE: "/motor/select-vehicle-type",
      CAR: {
        KNOWCARSTEPTWO: "/motor/car/knowcarstep-two",
        KNOWCARSTEPTHREE: "/motor/car/knowcarstep-three",
        NEWCAR: "/motor/car/new-car",
        PLANS: "/motor/car/plans",
        
        SHRIRAM: {
          SHRIRAMJOURNEY: "/motor/car/vendor/shriram/journey",
        },
      },

      BIKE: {
        KNOWBIKESTEPTWO: "/motor/bike/knowbikestep-two",
        KNOWBIKESTEPTHREE: "/motor/bike/knowbikestep-three",
        NEWBIKE: "/motor/bike/new-bike",
        BIKEPLANS: "/motor/bike/plans",
        SHRIRAM: {
          SHRIRAMJOURNEY: "/motor/bike/vendor/shriram/journey",
        },
      },

      VENDOR: {
        101: "/motor/car/vendor/shriram/journey",
      },
    },
    USER: {
      INDEX: "/userpnlx",
      CLAIM: "/userpnlx/claim",
      POLICY: "/userpnlx/policy",
      PROFILE: "/userpnlx/profile",
      // 'DASHBOARD': '/userpnlx/dashboard'
    },
    ADMIN: {
      INDEX: "/adminpnlx",
      ADMINDASHBOARD: "/adminpnlx/admin-dashboard",
    },
  },
  API: {
    HEALTH: {
      SENDOTP: "/api/sendotp",
      VERIFYOTP: "/api/verifyotp",
      PINCODE: "/api/acpincode",
      INSUREVIEW: "/api/insureview",
      GETINSURE: "/api/getinsureinfo",
      ILLNESS: "/api/illnesses",
      SAVEILLNESS: "/api/saveillnesses",
      PLANDATA: "/api/quoteview",
      FILTERPLAN: "/api/filterplan",
      GETQUOTE: "/api/health-quotation-generate",
      ACPINCODE: "/api/acdetails",
      CARESUPEREME: {
        CHECKOUT: "/api/addon",
        SETPREMIUM: "api/setpremium",
        PlANCHECKOUT: "/api/plancheckout",
        ADDADDONS: "/api/addaddon",
        PANVERIFY: "/api/verifypan",
        UPLOADDOCUMENT: "/api/uploadfile",
        AADHARVERIFY: "/api/verifyadhar",
        SAVESTEPONE: "/api/proposalStepOne",
        SAVESTEPTWO: "/api/proposalStepTwo",
        SAVESTEPTHREE: "/api/proposalStepThree",
        CREATEPOLICY: "/api/createpolicy",
        GETPROPOSAL: "/api/carepayment",
      },
      ULTIMATECARE: {
        CHECKOUT: "/api/health-ultimatecare/addon",
        SETPREMIUM: "/api/health-ultimatecare/setpremium",
        PlANCHECKOUT: "/api/health-ultimatecare/plancheckout",
        ADDADDONS: "/api/health-ultimatecare/addaddon",
        PANVERIFY: "/api/verifypan",
        UPLOADDOCUMENT: "/api/uploadfile",
        AADHARVERIFY: "/api/verifyadhar",
        SAVESTEPONE: "/api/proposalStepOne",
        SAVESTEPTWO: "/api/proposalStepTwo",
        SAVESTEPTHREE: "/api/proposalStepThree",
        CREATEPOLICY: "/api/createpolicy",
        GETPROPOSAL: "/api/carepayment",
      },
    },

    MOTOR: {
      LOGIN: "/api/motor/vehicle-type-select",
      VERIFYRTO: "/api/motor/verifyrto",
      BIKEVERIFYRTO: "/api/motor/bikeverifyrto",
      BRANDS: "/api/motor/getbrand",
      MODELS: "/api/motor/getmodel",
      GETCITY: "/api/motor/getcity",

      CAR: {
        SAVESTEPONE: "/api/motor-car/kn-car-details",
        KNOWCARDETAILSTWO: "/api/motor-car/kn-car-steptwo",
        KNOWCARDETAILSTHREE: "/api/motor-car/knowcarstepthree",
        NEWCARDETAILS: "/api/motor-car/new-car-details",
        NEWCARDETAILSTWO: "/api/motor-car/new-car-detailstwo",
        PLANS: "/api/motor-car/plans",
        ADDADDONS: "/api/motor-car/addaddon",
        QUOTE: "/api/motor-car/getcarquote",
        UPDATEIDV: "/api/motor-car/updateidv",
        CHANGEPLAN: "/api/motor-car/change-plan-type",
        PACOVERREASON: "/api/motor-car/pacoverreason",
        GETCACHEQUOTE: "/api/motor-car/getcachecarquote",
        ACCESSORIES: "/api/motor-car/accessories",


        SHRIRAM: {
          SAVEDATA: "/api/motor-car-shriram/journey",
          UPLOADDOCUMENT: "/api/motor-car-shriram/uploadfile",
          SAVESTEPONE: "/api/motor-car-shriram/savestepone",
          SAVESTEPTWO: "/api/motor-car-shriram/savesteptwo",
          SAVESTEPTHREE: "/api/motor-car-shriram/savestepthree",
        },
      },

      BIKE: {
        BIKESAVESTEPONE: "/api/motor-bike/kn-bike-details",
        KNOWBIKEDETAILSTWO: "/api/motor-bike/kn-bike-step-two",
        KNOWBIKEDETAILSTHREE: "/api/motor-bike/kn-bike-step-three",
        NEWBIKE: "/api/motor-bike/new-bike-details",
        NEWBIKEDETAILSTWO: "/api/motor-bike/new-bike-step-two",
        ADDADDONS: "/api/motor-bike/addaddon",
        PLANS: "/api/motor-bike/bike-plan",
        QUOTE: "/api/motor-bike/getbikequote",
        UPDATEIDV: "/api/motor-bike/updateidv",
        CHANGEPLAN: "/api/motor-bike/change-plan-type",
        PACOVERREASON: "/api/motor-bike/pacoverreason",
        GETCACHEQUOTE: "/api/motor-bike/getcachebikequote",
        ACCESSORIES: "/api/motor-bike/accessories",
       
      },
    },
    USER: {
      PROFILEUPDATE: "/api/userpnlx/user-profile-update",
      POLICY: "/api/userpnlx/user-policy",
    },
    ADMIN: {
      ADMINLOGIN: "/api/adminpnlx/admin-login",
      SENDOTP: "/api/adminpnlx/sendotp",
      VERIFYOTP: "/api/adminpnlx/verifyotp",
    },
  },
  QUESTION: {
    CAREDISEASE: {
      11: "Cancer or Tumor of any kind?",
      12: "Any heart related or circulatory system disorders?",
      13: "Hypertension/High Blood Pressure/Cholesterol disorder?",
      14: "Breathing/Respiratory issues (E.g.TB, Asthma, etc.)?",
      15: "Endocrine disorders (E.g. Thyroid related disorders, etc)?",
      16: "Diabetes/High blood sugar?",
      17: "Muscles or Nervous system related disorder or Stroke/Epilepsy/Paralysis or other brain related disorders?",
      18: "Liver/gallbladder or any other Gastro-Intestinal Disease?",
      19: "Kidney failure/Stone/Dialysis/Gynaecological/Prostate disease?",
      110: "Auto-immune or Blood related disorders (Rheumatoid arthritis, Thalassemia, etc.)?",
      111: "Any Congenital Disorder?",
      112: "HIV/AIDS/STD?",
      113: "Any other disease/health adversity/injury/condition/treatment not mentioned above?",
      114: "Has any of the Proposed to be Insured consulted/taken treatment or been recommended to take investigations/medication/surgery other than for childbirth/minor injuries?",
      115: "Has any of the Proposed to be Insured been hospitalized or has been under any prolonged treatment for any illness/injury or has undergone surgery other than for childbirth/minor injuries?",
      21: "Has any of the new person(s) to be insured ever filed a claim with their current / previous insurer?",
      22: "Has any proposal for Health Insurance of the new person(s) to be insured, been declined, cancelled or charged a higher premium?",
      23: "Is any of the person(s) to be insured already covered under any other health insurance policy of Care Health Insurance?",
      24: "Already covered",
      25: "Have any of the above mentioned person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?",
    },
    LIFESTYLE: {
      31: "Personal habit of smoking/ alcohol/gutkha/ tobacco/paan?",
      // You can add more if needed
    },
  },
};

export default constant;

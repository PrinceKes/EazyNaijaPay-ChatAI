const plans = {
    mtn: [
      { id: "500", name: "MTN SME Data 500MB – 30 Days" },
      { id: "M1024", name: "MTN SME Data 1GB – 30 Days" },
      { id: "M2024", name: "MTN SME Data 2GB – 30 Days" },
      { id: "3000", name: "MTN SME Data 3GB – 30 Days" },
      { id: "5000", name: "MTN SME Data 5GB – 30 Days" },
      { id: "10000", name: "MTN SME Data 10GB – 30 Days" },
      { id: "mtn-20hrs-1500", name: "MTN Data 6GB – 7 Days" },
      { id: "mtn-30gb-8000", name: "MTN Data 30GB – 30 Days" },
      { id: "mtn-40gb-10000", name: "MTN Data 40GB – 30 Days" },
      { id: "mtn-75gb-15000", name: "MTN Data 75GB – 30 Days" },
    ],
    glo: [
      { id: "glo100x", name: "Glo Data 1GB – 5 Nights" },
      { id: "glo200x", name: "Glo Data 1.25GB – 1 Day (Sunday)" },
      { id: "G500", name: "Glo Data 1.35GB – 14 Days" },
      { id: "G2000", name: "Glo Data 5.8GB – 30 Days" },
      { id: "G1000", name: "Glo Data 2.9GB – 30 Days" },
      { id: "G2500", name: "Glo Data 7.7GB – 30 Days" },
      { id: "G3000", name: "Glo Data 10GB – 30 Days" },
      { id: "G4000", name: "Glo Data 13.25GB – 30 Days" },
      { id: "G5000", name: "Glo Data 18.25GB – 30 Days" },
      { id: "G8000", name: "Glo Data 29.5GB – 30 Days" },
      { id: "glo10000", name: "Glo Data 50GB – 30 Days" },
    ],
    airtel: [
      { id: "AIRTEL500MB", name: "Airtel Data 500MB (Gift) – 30 Days" },
      { id: "AIRTEL1GB", name: "Airtel Data 1GB (Gift) – 30 Days" },
      { id: "AIRTEL2GB", name: "Airtel Data 2GB (Gift) – 30 Days" },
      { id: "AIRTEL5GB", name: "Airtel Data 5GB (Gift) – 30 Days" },
      { id: "airt-1100", name: "Airtel Data 1.5GB – 30 Days" },
      { id: "airt-3300", name: "Airtel Data 10GB – 30 Days" },
      { id: "airt-1650-2", name: "Airtel Data 6GB – 7 Days" },
    ],
    etisalat: [
      { id: "9MOB1000", name: "9mobile Data 1GB – 30 Days" },
      { id: "9MOB34500", name: "9mobile Data 2.5GB – 30 Days" },
      { id: "9MOB8000", name: "9mobile Data 11.5GB – 30 Days" },
      { id: "9MOB5000", name: "9mobile Data 15GB – 30 Days" },
    ],
  };

  




  


// const dataPlans = {
//     MTN: [
//       { id: "500", name: "MTN SME Data 500MB – 30 Days" },
//       { id: "M1024", name: "MTN SME Data 1GB – 30 Days" },
//       { id: "M2024", name: "MTN SME Data 2GB – 30 Days" },
//       { id: "3000", name: "MTN SME Data 3GB – 30 Days" },
//       { id: "5000", name: "MTN SME Data 5GB – 30 Days" },
//       { id: "10000", name: "MTN SME Data 10GB – 30 Days" },
//       { id: "mtn-20hrs-1500", name: "MTN Data 6GB – 7 Days" },
//       { id: "mtn-30gb-8000", name: "MTN Data 30GB – 30 Days" },
//       { id: "mtn-40gb-10000", name: "MTN Data 40GB – 30 Days" },
//       { id: "mtn-75gb-15000", name: "MTN Data 75GB – 30 Days" },
//     ],
//     GLO: [
//       { id: "glo100x", name: "Glo Data 1GB – 5 Nights" },
//       { id: "glo200x", name: "Glo Data 1.25GB – 1 Day (Sunday)" },
//       { id: "G500", name: "Glo Data 1.35GB – 14 Days" },
//       { id: "G2000", name: "Glo Data 5.8GB – 30 Days" },
//       { id: "G1000", name: "Glo Data 2.9GB – 30 Days" },
//       { id: "G2500", name: "Glo Data 7.7GB – 30 Days" },
//       { id: "G3000", name: "Glo Data 10GB – 30 Days" },
//       { id: "G4000", name: "Glo Data 13.25GB – 30 Days" },
//       { id: "G5000", name: "Glo Data 18.25GB – 30 Days" },
//       { id: "G8000", name: "Glo Data 29.5GB – 30 Days" },
//       { id: "glo10000", name: "Glo Data 50GB – 30 Days" },
//     ],
//     AIRTEL: [
//       { id: "AIRTEL500MB", name: "Airtel Data 500MB (Gift) – 30 Days" },
//       { id: "AIRTEL1GB", name: "Airtel Data 1GB (Gift) – 30 Days" },
//       { id: "AIRTEL2GB", name: "Airtel Data 2GB (Gift) – 30 Days" },
//       { id: "AIRTEL5GB", name: "Airtel Data 5GB (Gift) – 30 Days" },
//       { id: "AIRTEL10GB", name: "Airtel Data 10GB (Gift) – 30 Days" },
//       { id: "AIRTEL15GB", name: "Airtel Data 15GB (Gift) – 30 Days" },
//       { id: "AIRTEL20GB", name: "Airtel Data 20GB (Gift) – 30 Days" },
//       { id: "airt-1100", name: "Airtel Data 1.5GB – 30 Days" },
//       { id: "airt-1300", name: "Airtel Data 2GB – 30 Days" },
//       { id: "airt-1650", name: "Airtel Data 3GB – 30 Days" },
//       { id: "airt-2200", name: "Airtel Data 4.5GB – 30 Days" },
//       { id: "airt-3300", name: "Airtel Data 10GB – 30 Days" },
//       { id: "airt-5500", name: "Airtel Data 20GB – 30 Days" },
//       { id: "airt-11000", name: "Airtel Data 40GB – 30 Days" },
//       { id: "airt-330x", name: "Airtel Data 1GB – 1 Day" },
//       { id: "airt-550", name: "Airtel Data 750MB – 14 Days" },
//       { id: "airt-1650-2", name: "Airtel Data 6GB – 7 Days" },
//     ],
//     "9MOBILE": [
//       { id: "9MOB1000", name: "9mobile Data 1GB – 30 Days" },
//       { id: "9MOB34500", name: "9mobile Data 2.5GB – 30 Days" },
//       { id: "9MOB8000", name: "9mobile Data 11.5GB – 30 Days" },
//       { id: "9MOB5000", name: "9mobile Data 15GB – 30 Days" },
//     ],
//   };
  
//   export default dataPlans;
  
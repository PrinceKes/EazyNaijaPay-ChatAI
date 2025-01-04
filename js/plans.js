const plans = {
    mtn: [
      { id: "500", name: "MTN SME Data 500MB – 30 Days", price: 189 },
      { id: "M1024", name: "MTN SME Data 1GB – 30 Days", price: 299 },
      { id: "M2024", name: "MTN SME Data 2GB – 30 Days", price: 599 },
      { id: "3000", name: "MTN SME Data 3GB – 30 Days", price: 899 },
      { id: "5000", name: "MTN SME Data 5GB – 30 Days", price: 1499 },
      { id: "10000", name: "MTN SME Data 10GB – 30 Days", price: 2999 },
      { id: "mtn-20hrs-1500", name: "MTN Data 6GB – 7 Days", price: 1489 },
      { id: "mtn-30gb-8000", name: "MTN Data 30GB – 30 Days", price: 7899 },
      { id: "mtn-40gb-10000", name: "MTN Data 40GB – 30 Days", price: 9859 },
      { id: "mtn-75gb-15000", name: "MTN Data 75GB – 30 Days", price: 14899 },
    ],
    glo: [
      { id: "glo100x", name: "Glo Data 1GB – 5 Nights", price: 98 },
      { id: "glo200x", name: "Glo Data 1.25GB – 1 Day (Sunday)", price: 198 },
      { id: "G500", name: "Glo Data 1.35GB – 14 Days", price: 485 },
      { id: "G2000", name: "Glo Data 5.8GB – 30 Days", price: 1939 },
      { id: "G1000", name: "Glo Data 2.9GB – 30 Days", price: 969 },
      { id: "G2500", name: "Glo Data 7.7GB – 30 Days", price: 2439 },
      { id: "G3000", name: "Glo Data 10GB – 30 Days", price: 2939 },
      { id: "G4000", name: "Glo Data 13.25GB – 30 Days", price: 3879 },
      { id: "G5000", name: "Glo Data 18.25GB – 30 Days", price: 4839 },
      { id: "G8000", name: "Glo Data 29.5GB – 30 Days", price: 7779 },
      { id: "glo10000", name: "Glo Data 50GB – 30 Days", price: 9859 },
    ],
    airtel: [
      { id: "AIRTEL500MB", name: "Airtel Data 500MB (Gift) – 30 Days", price: 189 },
      { id: "AIRTEL1GB", name: "Airtel Data 1GB (Gift) – 30 Days", price: 299 },
      { id: "AIRTEL2GB", name: "Airtel Data 2GB (Gift) – 30 Days", price: 599 },
      { id: "AIRTEL5GB", name: "Airtel Data 5GB (Gift) – 30 Days", price: 1499 },
      { id: "airt-1100", name: "Airtel Data 1.5GB – 30 Days", price: 1069 },
      { id: "airt-3300", name: "Airtel Data 10GB – 30 Days", price: 3279 },
      { id: "airt-1650-2", name: "Airtel Data 6GB – 7 Days", price: 1629 },
    ],
    etisalat: [
      { id: "9MOB1000", name: "9mobile Data 1GB – 30 Days", price: 979 },
      { id: "9MOB34500", name: "9mobile Data 2.5GB – 30 Days", price: 1979 },
      { id: "9MOB8000", name: "9mobile Data 11.5GB – 30 Days", price: 7899 },
      { id: "9MOB5000", name: "9mobile Data 15GB – 30 Days", price: 9859 },
    ],
  };
  
  export default plans;
  





// const plans = {
//     mtn: [
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
//     glo: [
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
//     airtel: [
//       { id: "AIRTEL500MB", name: "Airtel Data 500MB (Gift) – 30 Days" },
//       { id: "AIRTEL1GB", name: "Airtel Data 1GB (Gift) – 30 Days" },
//       { id: "AIRTEL2GB", name: "Airtel Data 2GB (Gift) – 30 Days" },
//       { id: "AIRTEL5GB", name: "Airtel Data 5GB (Gift) – 30 Days" },
//       { id: "airt-1100", name: "Airtel Data 1.5GB – 30 Days" },
//       { id: "airt-3300", name: "Airtel Data 10GB – 30 Days" },
//       { id: "airt-1650-2", name: "Airtel Data 6GB – 7 Days" },
//     ],
//     etisalat: [
//       { id: "9MOB1000", name: "9mobile Data 1GB – 30 Days" },
//       { id: "9MOB34500", name: "9mobile Data 2.5GB – 30 Days" },
//       { id: "9MOB8000", name: "9mobile Data 11.5GB – 30 Days" },
//       { id: "9MOB5000", name: "9mobile Data 15GB – 30 Days" },
//     ],
//   };

    
// export default plans;










// const plans = {
//   mtn: [
//     { id: "500", name: "MTN SME Data 500MB – 30 Days", price: 189 },
//   ],
//   glo: [
//     { id: "glo100x", name: "Glo Data 1GB – 5 Nights", price: 98 },
//   ],
//   airtel: [
//     { id: "AIRTEL500MB", name: "Airtel Data 500MB (Gift) – 30 Days", price: 189 },

//   ],
//   etisalat: [
//     { id: "9MOB1000", name: "9mobile Data 1GB – 30 Days", price: 979 },
//   ],
// };

// export default plans;


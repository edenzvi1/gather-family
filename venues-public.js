// Initial, non-exhaustive directory. Business facts from each linked public source.
// No Google Places content, reviews or unlicensed photographs are copied.
const publicVenueCatalog=[
 {id:'public-lago',name:'לאגו',region:'שפלה',city:'ראשון לציון',address:'המאה ועשרים 6, ראשון לציון',phone:'072-2800100',sourceUrl:'https://www.lago-events.co.il/',spaces:[{name:'Soul',capacity:450}],capacityNote:'הקיבולת מתייחסת לחלל Soul בלבד; חללים נוספים יש לברר מול האולם.'},
 {id:'public-avenue',name:'אווניו',region:'מרכז',city:'איירפורט סיטי',address:'השרון 1, איירפורט סיטי',phone:'072-3726318',sourceUrl:'https://avenue-l.co.il/en/contact-us/'},
 {id:'public-kala',name:'קאלה',region:'חיפה',city:'חיפה',address:'יוליוס סימון 3, חיפה',phone:'077-2319677',sourceUrl:'https://www.kala.co.il/',spaces:[{name:'PRIME',capacity:null},{name:'MITOS',capacity:null}]},
 {id:'public-hinooma',name:'הינומה',region:'חיפה',city:'אזור חיפה',address:null,phone:null,sourceUrl:'https://hinooma.com/',spaces:[{name:'פנינה',capacity:500},{name:'הילה',capacity:1000}]},
 {id:'public-agamim-beer-sheva',name:'אגמים — באר שבע',region:'דרום',city:'באר שבע',address:'הקישון 32, באר שבע',phone:'08-6202500',sourceUrl:'https://www.agamim-events.co.il/',spaces:[{name:'OASIS — הגן',capacity:400},{name:'OCEAN',capacity:1000},{name:'LAGOON',capacity:500}]},
 {id:'public-agamim-ashkelon',name:'אגמים — אשקלון',region:'דרום',city:'אשקלון',address:null,phone:null,sourceUrl:'https://agamimashkelon.co.il/',spaces:[{name:'אולם בוטיק',capacity:350}]},
 {id:'public-ronit',name:'חוות רונית',region:'שרון',city:'אזור שפיים',address:'ממזרח לקיבוץ שפיים; יש לאמת כתובת הגעה מול המקום',phone:'09-9584181',sourceUrl:'https://ronitfarm.com/',capacityNote:'הקיבולת שונה לפי החלל וסוג האירוע; יש לברר מול המקום.'},
 {id:'public-eden',name:'עדן — גן האירועים',region:'שרון',city:'ניר אליהו',address:'קיבוץ ניר אליהו',phone:'055-4539499',sourceUrl:'https://www.gan-eden.co.il/'},
 {id:'public-pekan',name:'גן הפקאן',region:'שרון',city:'רמת הכובש',address:'רמת הכובש',phone:'055-4539526',sourceUrl:'https://pekangarden.co.il/home/'},
 {id:'public-vradim',name:'גן ורדים',region:'שפלה',city:'ראשון לציון',address:'הרצל 150, ראשון לציון',phone:'03-9664747',sourceUrl:'https://www.gvradim.com/'},
 {id:'public-adia',name:'עדיה',region:'שפלה',city:'יבנה',address:'שידלובסקי 3, יבנה',phone:'073-7533448',sourceUrl:'https://adia.co.il/',contactSource:'https://adia.co.il/צור-קשר/',spaces:[{name:'בוטיק',capacity:520}],capacityNote:'פורסמה קיבולת לחלל בוטיק; חלל פאלאס דורש בירור נפרד.'},
 {id:'public-hatzar-netzer',name:'חצר נצר',region:'שפלה',city:'נצר סרני',address:'קיבוץ נצר סרני',phone:'08-9213939',sourceUrl:'https://artilerya.wixsite.com/netzer2'},
 {id:'public-kedma',name:'קדמא',region:'ירושלים',city:'נווה אילן',address:'נווה אילן',phone:'02-5700171',sourceUrl:'https://kedma-garden.com/'},
 {id:'public-sandrine',name:'אחוזת סנדרין',region:'צפון',city:'רגבה',address:'מתחם BIG רגבה, רגבה',phone:'04-6222221',sourceUrl:'https://www.sandrine-events.com/',capacityNote:'האתר מציין עד 1,800 אורחים במתחם; חלוקה וקיבולת לכל חלל דורשות בירור.'},
 {id:'public-harmonia',name:'הרמוניה בגן',region:'שפלה',city:'צומת כנות',address:'צומת כנות — יש לאמת כתובת הגעה מדויקת מול האולם',phone:'077-9977799',sourceUrl:'https://www.harmoniabagan.co.il/',spaces:[{name:'קלאס',capacity:900},{name:'קלאב',capacity:450}]},
 {id:'public-dorya',name:'דוריה',region:'דרום',city:'אזור חמי יואב',address:'כביש 35, צמוד לחמי יואב, בין אשקלון לקריית גת',phone:'08-8505059',sourceUrl:'https://evrst.co.il/dorya/צור-קשר/'},
 {id:'public-kochav-hayam',name:'כוכב הים',region:'חיפה',city:'שדות ים',address:'קיבוץ שדות ים, ד״נ מנשה 37804',phone:'072-3384828',sourceUrl:'https://www.kochavhayam.co.il/'}
].map(venue=>({...venue,sourceType:'venue-public-website',checkedAt:'2026-10-31',subscriber:false,imageUrl:null}));
if(typeof module!=='undefined')module.exports={publicVenueCatalog};

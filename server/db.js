const thinky = require('thinky')();
export let r = thinky.r;

let type = thinky.type;

export let Deal=thinky.createModel("Deal",{
   id: type.string(),
   title: type.string(),
   images: type.array(),
   description: type.string(),
   highlights: type.string(),
   endDate: type.date(),
   watchCount: type.number(),
   payout: type.number(),
   discount: type.number(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
   idLike: type.number().default(0),
   idBusiness: type.string(),
});
export let Like = thinky.createModel('Like', {
  id: type.string(),
  idDeal: type.string(),
  idUser: type.string(),
  createdAt: type.date().default(r.now()),
  updatedAt: type.date().default(r.now()),
});
export let Certificate=thinky.createModel("Certificate",{
   id: type.string(),
   title: type.string(),
   boughtCount: type.number().default(0),
   totalCount: type.number(),
   oldPrice: type.number(),
   newPrice: type.number(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
   idDeal: type.string()
})
export let User=thinky.createModel("User",{
   id: type.string(),
   image: type.string(),
   email: type.string(),
   balance: type.number(),
   city: type.string(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
})
export let Tag=thinky.createModel("Tag",{
   id: type.string(),
   text: type.string(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
})
export let Business=thinky.createModel("Business",{
   id: type.string(),
   name: type.string(),
   city: type.string(),
   street: type.string(),
   phones: type.array(),
   image: type.string(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
   idAdmin: type.string(),
})
export let Comment=thinky.createModel("Comment",{
   id: type.string(),
   text: type.string(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
   idDeal: type.string(),
   idAuthor: type.string(),
})
export let Notification = thinky.createModel("Notification", {
   id: type.string(),
   type: type.string(),
   text: type.string(),
   createdAt: type.date().default(r.now()),
   updatedAt: type.date().default(r.now()),
   idDeal: type.string(),
   idReceiver: type.string(),
   idSender: type.string(),
})
// export let Referral=thinky.createModel('Referral',{
//    id:type.string(),
//    soldCount:type.string(),
//    idReferree:type.string(),
//    idDeal:type.string(),
// })
// export let Order=thinky.createModel('Order',{
//    id:type.string(),
//    idCertificate: type.string(),
//    idReferral: type.string(),
//    idReferree:type.string(),
//    idDeal:type.string(),
// })
// Deal.hasMany(Referral)
// Referral.belongsTo(User,'referree')
// Referral.hasAndBelongsToMany(User,'buyers','id','id')

User.hasAndBelongsToMany(Deal,'likedDeals','id','id')
User.hasAndBelongsToMany(Deal,'referredDeals','id','id')
User.hasAndBelongsToMany(Deal,'soldDeals','id','id')
User.hasAndBelongsToMany(Certificate,'boughtCertificates','id','id')
Deal.hasAndBelongsToMany(Tag,'tags','id','id')
Deal.belongsTo(Business,'business','idBusiness','id')
Deal.hasMany(Like,'likes','id','idDeal')
Comment.belongsTo(User,'author','id','idAuthor')
Deal.hasMany(Comment,'comments','id','idDeal')
Deal.hasMany(Certificate,'certificates','id','idDeal')
User.hasMany(Business,'businesses','id','idAdmin')
User.hasMany(Notification,'receivedNotifications','id','idReceiver')
User.hasMany(Notification,'sentNotifications','id','idSender')
Deal.hasMany(Notification,'dealNotifications','id','idDeal')



// r.table("Deal").insert({ title: "Buy trip to Miami with 20% discount", images: [
//   "https://besmart.kz/media/events/images/218/109352.jpg.633x370_q100_crop-smart.jpg",
//   "https://besmart.kz/media/events/images/218/109272.jpg.633x370_q100_crop-smart.jpg"
// ], description: "Very good trip, you should go and enjoy and smoke some weed", endDate: "2012-04-23T18:25:43.511Z", highlights: "no hightlight", watchCount: 0, discount: 20, payout: 10 })


// insert([{name:'Ilyas',image:'http://zblogged.com/wp-content/uploads/2015/11/5.png',balance:2120,city:'Almaty',email:'ilyaskz7@gmail.com'},{name:'Almas',image:'http://zblogged.com/wp-content/uploads/2015/11/31.jpg',balance:10000,city:'Almaty',email:'almas@gmail.com'}])






import {Deal,Comment,r,thinky,User,Business} from './db'

// Comment.filter({idDeal:'1f6527f3-c99d-4ff0-b31f-09cb793b966f'}).orderBy(r.desc('createdAt')).pluck('id').then(x=>console.log(x))
 // Comment.filter({idDeal:'1f6527f3-c99d-4ff0-b31f-09cb793b966f'}).orderBy(r.desc('createdAt')).slice(0,2).pluck('id','text').then(x=>console.log(x))
// let query=r.table("Comment").range(0,1)

// let Query=thinky.Query
// let q = new Query(Comment,query).().then(x=>console.log(x))

// let users=User.then(users=>{
// 	Deal.get('1f6527f3-c99d-4ff0-b31f-09cb793b966f').then(deal=>{
// 		users.map(user=>{
// 			user.likedDeals=[deal]
// 			user.saveAll({likedDeals:true}).then(res=>console.log(res))
// 		})	
// 	})

// })
// 16bca56f-7fb4-469b-8815-1edfd557d244 id almas user

// User.get('16bca56f-7fb4-469b-8815-1edfd557d244').pluck('id').getJoin({likedDeals:{
//             _apply:(seq)=>seq.orderBy(r.desc('createdAt')).slice(0,4)
//           }}).then(x=>console.log(x))

// let business=new Business({
//    name: 'Insta Deal',
//    city: 'Almaty',
//    street: 'Satpaeva 30 a',
//    phones: ['87013243242','87058383745'],
//    image: 'http://i2.cdn.turner.com/cnnnext/dam/assets/140929114015-sarah-aarthun-profile-image-large-169.jpg',
//    idAdmin:'16bca56f-7fb4-469b-8815-1edfd557d244'
// })
// business.save().then(x=>{

// 	Deal.get('1f6527f3-c99d-4ff0-b31f-09cb793b966f').then(deal=>{
// 		deal.idBusiness=x.id
// 		deal.saveAll({business:true}).then(x=>console.log(x))
// 	})


// })

// Deal.pluck('id','idBusiness').getJoin({business:{_apply:seq=>seq.pluck('id')}}).then(x=>console.log(x))

User.get('16bca56f-7fb4-469b-8815-1edfd557d244').then(user=>{
	console.log(user);
	user.city = 'Atyrau';
	user.save().then(user => console.log(user));
});

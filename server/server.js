import express from 'express';
import Router from 'falcor-router';
import bodyParser from 'body-parser';
import falcorServer from 'falcor-express';
import Rx from 'rx';
import falcor from 'falcor'
import {Deal,Comment,r,User,Business,Tag,Certificate,Like,Notification} from './db'
let $ref=falcor.Model.ref
let app = express();

let pathValuesStack = [];

let ServerRouter = Router.createClass([
  {
    route:"dealsById[{keys:dealIds}][{keys:fields}]",
    get: pathSet=>{
      return console.log('go into deals by id')|| Rx.Observable.
        from(pathSet.dealIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(Deal.get(id).pluck(...pathSet.fields)).map(deal=>{
            return Object.assign({},deal,{id})
          })
        }
        ).
        map(deal => {
          let result = pathSet.fields.map(field =>{
           return {
            path: ['dealsById', deal.id, field],
            value: deal[field]
           };
          });
          return result 
        })
      },
    },
  ])

let serverModel = new falcor.Model({
  source: new ServerRouter(),
});


let InstaDealRouter = Router.createClass([
  {
    route: "featuredDeals[{keys:fields}][{integers:range}]", // fields one of ['hasData', 'edges', 'count'] ['edges', 'meta']
    call: (callPath, args) => console.log('callPath is ', callPath) || Rx.Observable.
      fromPromise(
        Deal.
          // filter({ city: args.city }).
          // TODO change discount to likes
          orderBy(r.desc('discount')).
          slice(0, range.length)
      ).map(deals => {
        console.log('Deals from db are ', deals);
        let edgePaths = deals.
          map((deal, i) => ({
            path: ['featuredDeals', 'edges', i],
            value: $ref(['dealsById', deal.id])
          }))
        if (callPath.hasData) {
          edgePaths.push({
            path: ['featuredDeals', 'hasData'],
            value: deals.length < callPath.range.length
          })          
        }
        console.log('return Paths are ', edgesPaths)
        return edgePaths;
      })
  },
// [featuredDeals,where:city=Almaty,edges,[from 1 to 10],ref]
  {
    route: "featuredDeals[{keys:filters}][{keys:fields}][{integers:range}]", // fields one of ['hasData', 'edges', 'count'] ['edges', 'meta']
    get: (pathSet) => Rx.Observable.
      from(pathSet.filters).
      flatMap(filter=>
          Rx.Observable.fromPromise(Deal.
            filter({city: filter.split(':')[1].split('=')[1]}).
            orderBy(r.desc('discount')).
            slice(0, pathSet.range.length))
      ).map(deals => {
        let pathValues = deals.
          map((deal, i) => ({
            path: ['featuredDeals',pathSet.filters[0],'edges', i],
            value: $ref(['dealsById', deal.id])
          }))
        if (pathSet.fields.hasData) {
          pathValues.push({
            path: ['featuredDeals',pathSet.filters[0], 'hasData'],
            value: deals.length < pathSet.range.length
          })          
        }
        pathValuesStack.push(pathValues);
        return pathValues;
      })
  },



  {
    route:"dealsById[{keys:dealIds}][{keys:fields}]",
//     [ { path: [ 'dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'title' ],
//     value: 'Buy trip to Miami with 20% discount' } ]
// [ { path: [ 'dealsById', 'cce23b62-5b13-46ee-9d93-3a0b5df741db', 'title' ],
//     value: 'go to awesome stack, kill relay for good' } ]
// [ { path: [ 'dealsById', 'c3202ba8-2896-4633-838f-aac2d08dbcae', 'title' ],
//     value: 'third deal today' } ]
    get: pathSet =>  Rx.Observable.fromPromise(
      serverModel.get([pathSet[0], pathSet[1], pathSet[2]])
    ).map(x => pathValuesStack.pop()).subscribe(console.log)
    
    // get: pathSet=>{
    //   console.log('============= pathSet is ', [pathSet[0], pathSet[1], pathSet[2]],pathSet.length);
    //   return console.log('go into deals by id')|| Rx.Observable.
    //     from(pathSet.dealIds).
    //     flatMap(id =>{
    //       return Rx.Observable.fromPromise(Deal.get(id).pluck(...pathSet.fields)).map(deal=>{
    //         return Object.assign({},deal,{id})
    //       })
    //     }
    //     ).
    //     map(deal => {
    //       let result = pathSet.fields.map(field =>{
    //        return {
    //         path: ['dealsById', deal.id, field],
    //         value: deal[field]
    //        };
    //       });
    //       console.log(result)
    //       return result 
    //     })
    // },
  },
  {
    route:"dealsById[{keys:dealIds}].comments[{integers:commentRange}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.dealIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(Comment.filter({idDeal:id}).orderBy(r.desc('createdAt'))
            .slice(pathSet.commentRange[0],pathSet.commentRange[pathSet.commentRange.length]).pluck('id'))
            .map(comments=>{
              return comments.map(comment => Object.assign({},comment,{dealId: id}))
            })
        }).
        map(comments => {
          let result=pathSet.commentRange.slice(0,comments.length).map((index,i)=>{
            return{
              path:['dealsById',comments[i].dealId,'comments',index],
              value:$ref(['commentsById',comments[i].id])
            }
          })
          return result
        })
    },
  },
    {
    route:"dealsById[{keys:dealIds}].business",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.dealIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(Deal.get(id).pluck('id','idBusiness').getJoin({business:{
            _apply:seq=>seq.pluck('id')
            }}))
            .map(deal=>{
              return Object.assign({},deal.business,{dealId:id})
            })
        }).
        map(business => {
            return{
              path:['dealsById',business.dealId,'business'],
              value:$ref(['businessesById',business.id])
            }
          return result
        })
    },
  },
   {
    route:"businessesById[{keys:businessIds}][{keys:fields}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.businessIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(Business.get(id).pluck(...pathSet.fields)).map((business)=>{
            return Object.assign({}, business, {id})
          })
        }).
        map(business => {
          let result = pathSet.fields.map(field =>{
           return {
            path: ['businessesById', business.id, field],
            value: business[field]
           };
          });
          return result 
        })
    },
  },
  {
    route:"commentsById[{keys:commentIds}][{keys:fields}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.commentIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(Comment.get(id).pluck(...pathSet.fields)).map((comment)=>{
            return Object.assign({}, comment, {id})
          })
        }).
        map(comment => {
          const result = pathSet.fields.map(field =>{
           return {
            path: ['commentsById', comment.id, field],
            value: comment[field]
           };
          });
          return result 
        })
    },
  },
  {
    route:"usersById[{keys:userIds}][{keys:fields}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.userIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(User.get(id).pluck(...pathSet.fields)).map(user=>{
            return Object.assign({},user,{id})
          })
        }
        ).
        map(user => {
          let result = pathSet.fields.map(field =>{
           return {
            path: ['usersById', user.id, field],
            value: user[field]
           };

          });
          return result 
        })
    },
    set: jsonGraphArg => Rx.Observable.
      from(Object.keys(jsonGraphArg.usersById)).
      flatMap(id => 
        // TODO Rx.Observable.fromPromise(User.get(id).pluck(...Object.keys(jsonGraphArg.usersById[id])).
        Rx.Observable.fromPromise(User.get(id)).
          map(user => 
            Object.assign({},user, jsonGraphArg.usersById[id])
          ).flatMap(updatedUser =>
            Rx.Observable.fromPromise(updatedUser.save())
          )
      ).map(savedUser => 
        Object.keys(jsonGraphArg.usersById[savedUser.id]).
          map(field => ({
            path: ['usersById', savedUser.id, field],
            value: savedUser[field]
          }))
      )
   },
   {
    route:"usersById[{keys:userIds}].likedDeals[{integers:dealRange}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.userIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(User.get(id).pluck('id').getJoin({likedDeals:{
            _apply:(seq)=>seq.orderBy(r.desc('createdAt')).slice(pathSet.dealRange[0],pathSet.dealRange[pathSet.dealRange.length])
          }}))
            .map(user=>{
              let deals=user.likedDeals
              return deals.map(deal => Object.assign({},deal,{userId: id}))
            })
        }).
        map(deals => {
          let result=pathSet.dealRange.slice(0,deals.length).map((index,i)=>{
            return{
              path:['usersById',deals[i].userId,'likedDeals',index],
              value:$ref(['dealsById',deals[i].id])
            }
          })
          return result
        })
    },
  },
   {
    route:"usersById[{keys:userIds}].referredDeals[{integers:dealRange}]",
    get: pathSet=>{
      return Rx.Observable.
        from(pathSet.userIds).
        flatMap(id =>{
          return Rx.Observable.fromPromise(User.get(id).pluck('id').getJoin({referredDeals:{
            _apply:(seq)=>seq.orderBy(r.desc('createdAt')).slice(pathSet.dealRange[0],pathSet.dealRange[pathSet.dealRange.length])
          }}))
            .map(user=>{
              let deals=user.likedDeals
              return deals.map(deal => Object.assign({},deal,{userId: id}))
            })
        }).
        map(deals => {
          let result=pathSet.dealRange.slice(0,deals.length).map((index,i)=>{
            return{
              path:['usersById',deals[i].userId,'referredDeals',index],
              value:$ref(['dealsById',deals[i].id])
            }
          })
          return result
        })
    },

  },

]);

app.use(bodyParser.urlencoded({extended: false}));
app.use('/model.json', falcorServer.dataSourceRoute(
  () => new InstaDealRouter())
);


app.listen(3000,
  err => err ?
  console.log(err) :
  console.log('navigate to localhost:3000')
);








    // jsonGraphArg = { usersById: { '16bca56f-7fb4-469b-8815-1edfd557d244': { name: 'Ilyas Malgazhdarov' } } }
    // {
    //     "usersById": {
    //         "16bca56f-7fb4-469b-8815-1edfd557d244": {
    //             "city": "Astana",
    //             "name": "Ilyas Malgazhdarov"
    //         },
    //         "4a678fb7-0f35-45ef-9bb8-442b57798c01": {
    //             "city": "Astana",
    //             "name": "Almas Akchabayev"
    //         }
    //     }
    // }
import Rx from 'rx';
import falcor from 'falcor';
import FalcorHttpDatasource from 'falcor-http-datasource';
import deepAssign from 'deep-assign';
export let action$ = new Rx.Subject();//action stream for reading and writing data
export let data$ = new Rx.ReplaySubject(1);//data stream of state

let model = new falcor.Model({
  source: new FalcorHttpDatasource('http://localhost:3000/model.json'),
});
model.get(
	['featuredDeals', 'where:city=Astana', 'edges', { from: 0, to : 2}, ['title']],
	['featuredDeals','where:city=Astana','hasData']
)
	.then(x => console.log(x,'-=-=-=-=-=-'))
	console.log('fishy richard =-=-=-=-=-=-=-=-==-=-=')
action$.subscribe(action => {

  switch(action.type) {
	  case 'get': model.get(action.path).then(data =>
		data$.onNext(data.json)
	  )
	  case 'set': model.set(action.path, action.value)
	  case 'call': model.call(action.path, action.value).then(data =>
		  	data$.onNext(deepAssign(data.json,{featuredDeals: { isFetching: false }})
	  	)
	  )    
  }
})
export let state$ = data$.scan((state , data) =>deepAssign(state,data))
state$.subscribe(x=>console.log('=============',x,'============'))
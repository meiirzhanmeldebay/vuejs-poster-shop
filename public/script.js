let PRICE = 9.99;
let LOAD_NUMBER = 10;
// let elem = document.getElementById('product-list-bottom');
// let watcher = scrollMonitor.create(elem);

new Vue ({
	el:'#app',
	data: {
		search: 'anime',
		lastSearch: '',
		total: 0,
		loading:false,
		items:[
			
		],
		results:[],
		append : [],
		cart:[],
	},
	mounted(){
		this.onSubmit(this.search);
		let elem = document.getElementById('product-list-bottom');
		let watcher = scrollMonitor.create(elem);
		// var _this = this
		watcher.enterViewport(()=>{
			this.appendItems();	
		})
	},
	computed:{
		checkItems(){
			return this.items.length==this.results.length && this.results.length>0
		}
	},
	methods:{
		appendItems(){
			if(this.items.length < this.results.length){
				var append = this.results.slice(this.items.length,this.items.length + LOAD_NUMBER);
				this.items = this.items.concat(append)
			}
		},
		onSubmit(){
			if(this.search.length){
				this.items = [];
				this.loading = true;
				this.$http.get('search/'.concat(this.search))
				.then((res)=>{
					this.lastSearch = this.search;
					this.results = res.data; 
					this.appendItems();				
					this.loading = false;
				})
			}
		},
		addItem(index){
			var item = this.items[index];
			this.total += PRICE; 
			var found = false;
			for(var i =0; i<this.cart.length;i++){
				if(this.items[i].id == item.id){
					found = true;
					this.cart[i].qty++;
					break;
				}
			}
			if(!found){
				this.cart.push({
					id: item.id,
					title : item.title,
					qty: 1,
					price: PRICE,
					// total : item.price * item.qty
				})
			}
		},
		inc(item){
			item.qty ++;
			this.total += item.price;			
		},
		dec(item){
			item.qty--;
			this.total -=item.price;
			if(item.qty<=0){
				for(var i =0; i<this.cart.length; i++ ){
					if(this.cart[i].id === item.id){
						this.cart.splice(i,1);
						break;
					}
				}
			}
		}
	},
	filters:{
		currency(value){
			return  '$'.concat(value.toFixed(2))
		},		
	}
});



new Vue({
    el: '#app',
    data:{
        name: 'Lesson Booking System',
        order: true,
        sortBy: 'name',
        lessons: [],
        newOrder: {},
        searchedLessons: [],
        market: true,
        cart: [],
        total: 0,
        checkout: {
            name: '',
            phone: '',
            stats: true 
        },
        searchQuery: '',
        searchstats: false
    },
    mounted(){
        this.fetchLessons();
    },
    methods:{
        sortLessons(property, order) {
             
            this.lessons.sort((a, b) => { 
                let aProp = property === 'price' ? Number(a[property]) : a[property];
                let bProp= property === 'price' ? Number(b[property]) : b[property];
                if (aProp > bProp) return order ? 1 : -1; 
                if (aProp < bProp) return order ? -1 : 1; 
                return 0; 
            }); 
        },
        orderedLessons(){
            console.log(this.sortBy);
            this.sortLessons(this.sortBy, this.order);
            this.order = !this.order;                     
        },

    }
})
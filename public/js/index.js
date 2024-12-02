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
})
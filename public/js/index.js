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
        async fetchLessons(){
            try {
                const res = await fetch('https://cst3144backend.onrender.com/lessons');
                const lessons = await res.json();
                this.lessons = lessons;
            } catch (error) {
                console.log(error)
            }
        },
        async searchLessons(){
            const query = this.searchQuery.trim().toLowerCase();
            if(query.length >= 1){
                // add logic to hide lessons and show searched lessons
                this.searchstats = true;
                try{
                    const res = await fetch(`https://cst3144backend.onrender.com/search?query=${query}`);
                    this.searchedLessons = await res.json();
                    console.log(this.searchedLessons);
                }
                catch(error){
                    console.log(error);
                }

            }
            else{
                this.searchstats = false;
            }
        },
        async createOrder(){
            try{
                console.log(this.newOrder);
                console.log(JSON.stringify(this.newOrder));
                const res = await fetch('https://cst3144backend.onrender.com/order',
                {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newOrder)

                    
                });
                
                if (!res.ok) { 
                    throw new Error('Couldnt complete request');
                }
                alert('Order has been submitted');

            }
            catch(error){
                console.log(error);
                alert('Error creating order');
            }
        },
        async updateLessons(updateLessonJson){
            try{
                const updatejson = updateLessonJson;

                const res = await fetch('https://cst3144backend.onrender.com/lessons',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatejson)
                })
                if(!res.ok){
                    throw new Error('Couldnt complete request');
                }
                alert('Lesson updated successfully!');
            }
            catch(error){
                console.log(error);
                alert('Error updating lessons');
            }
        },
        addToCart(lesson){
            let les;
            let cartLesson;
            let newCartLesson;
            let found;
            // need to update both search and normal lesson arrays
            if(this.searchstats){
                for (let index = 0; index < this.searchedLessons.length; index++){
                    les = this.searchedLessons[index]
                    if(les.id === lesson.id){
                        les.spaces--;
                        les.taken++;
                    }
                }
            }
            for (let index = 0; index < this.lessons.length; index++) {
                // using the id from the html to find the lesson in array
                les = this.lessons[index]
                if(les.id === lesson.id){
                    les.spaces--;
                    les.taken++;
                    // add logic for empty cart array as well
                    
                    if(this.cart.length > 0){
                        // checking if lesson is in cart 
                        found = false;
                        for (let i = 0; i < this.cart.length; i++){
                            cartLesson = this.cart[i];
                            if(lesson.id === cartLesson.id){
                                found = true;
                                break;
                            }
                        }
                        if(found){
                            cartLesson.amount++
                        }
                        else{
                            newCartLesson = {id: les.id, name: les.name, price: les.price, imgurl: les.imgurl, amount: 1};
                            this.cart.push(newCartLesson);
                        }
                        
                    }
                    else{
                        newCartLesson = {id: les.id, name: les.name, price: les.price, imgurl: les.imgurl, amount: 1};
                        this.cart.push(newCartLesson);
                    }
                    // console.log(this.cart)
                    // this.cart.push(les);
                    this.total++;
                    break;
                }
                
                
            }
        },
        removeFromCart(lesson){
            let les;
            let cartLesson;
            if(this.searchstats){
                for (let index = 0; index < this.searchedLessons.length; index++){
                    les = this.searchedLessons[index]
                    if(les.id === lesson.id){
                        les.spaces++;
                        les.taken--;
                    }
                }
            }
            for (let index = 0; index < this.lessons.length; index++){
                les = this.lessons[index]
                if(les.id === lesson.id){
                    les.spaces++;
                    les.taken--;
                    
                    for (let i = 0; i < this.cart.length; i++){
                        cartLesson = this.cart[i];
                        if(lesson.id === cartLesson.id){
                            
                            if(cartLesson.amount > 1){
                                cartLesson.amount--;
                            }
                            else{
                                this.cart.splice(i, 1);
                            }
                            
                        }                        

                    }
                    this.total--;
                }
                    
            }
            
        },
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
        validateFields(){
            console.log('hi');
            const nameRegex = /^[A-Za-z]{3,}$/; 
            const phoneRegex = /^[0-9]{5,}$/;
            // let check = 
            
            if(nameRegex.test(this.checkout.name) && phoneRegex.test(this.checkout.phone)){
                this.checkout.stats = false;
            }
            
        },
        checkOut(){
            this.newOrder = {name: this.checkout.name, phone: this.checkout.phone, lessonIDs: []};
            this.addCartLessonIDsToOrder(this.newOrder, this.cart);
            this.createOrder();
            this.updateLessons(this.lessons);
            // console.log('Input JSON:', JSON.parse(this.lessons));
            // const updatedLessons = JSON.parse(this.updatedLessonsJson);


        },
        addCartLessonIDsToOrder(order, cart){
            // order.lessonIDs = cart.map(cartLesson => cartLesson.id);
            order.lessonIDs = cart.map(cartLesson => ({
                id: cartLesson.id,
                spaces: cartLesson.amount
            }));
            console.log(order)
        }

    }
})
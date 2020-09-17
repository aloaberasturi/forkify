import axios from 'axios';


export default class Recipe{
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.publisher_url = res.data.recipe.publisher_url;
            this.image = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch(error) {
            alert('Something went wrong when receiving the recipe ):');
        }
    }

    calcTime() {
        // Assuming that we need 15 minutes for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoon', 'teaspoons', 'tsps','ounce', 'ounces', 
                        'ozs', 'cups', 'pounds', 'kilogram','kilograms', 'kgs', 'gram','grams', 'gs'];
        const unitsShort = ['tbsp', 'tbsp', 'tsp','tsp','tsp', 'oz', 'oz', 'oz', 'cup', 'pound', 'kg', 'kg', 'kg', 'g','g'];

        const newIngredients = this.ingredients.map(el => {

            // 1) Uniform units
            let ingredient = el.toLowerCase(); 
            unitsLong.forEach( (element, i) =>{
                ingredient = ingredient.replace(element, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, init and ingredient
            const arrIng = ingredient.split(' ');

            // test if in the ingredients text there is any mention of units
            const  unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;

            if (unitIndex > -1){
                // there is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if (arrCount.length === 1){
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count =  eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                // no unit, but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '', 
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1){
                // there is NO unit
                objIng = {
                    count: 1,
                    unit: '', 
                    ingredient
                }
            }
            
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type ==='dec' ? this.servings - 1 : this.servings + 1; // this doesn't update servings

        // Ingredients
        this.ingredients.forEach( el => {
            el.count *= (newServings/this.servings);
        })
        this.servings = newServings;
    };
}
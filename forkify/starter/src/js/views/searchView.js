import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResultsList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage; // end not included in slice

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination
    renderButtons(page, recipes.length, resPerPage);
        
};

const createButton = (type, page) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page + 1 : page - 1}>
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>
    `

const renderButtons = (page, numResults, resPerPage) => {

    const pages = Math.ceil(numResults / resPerPage);
    let markup;

    if (page === 1 && pages > page) {
        //  button next
        markup = createButton('next', page);
        
    } else if (page === pages && pages > 1) {
        // button prev
        markup = createButton('prev', page);

    } else {
        // both buttons
        markup = `
            ${createButton('prev', page)};
            ${createButton('next', page)};
        `;
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', markup);

};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>    
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>    
            </a>    
        </li>    
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};    

export const highlightSelected = id => {

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = ( title, limit = 17) => {
    const newTitle = []; /* what is const here is the memory reference
                        to the array, not the contents of the array */ 
    if (title.length > limit) {                
        title.split(' ').reduce( (acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }    
            return acc + length;
        },0);    
        // return the result
        return `${newTitle.join(' ')} ...`;

    }    
    return title;
};    


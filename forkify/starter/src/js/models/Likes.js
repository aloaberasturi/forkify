export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike (id, title, publisher, image) {
        const like = {
            id,
            title,
            publisher,
            image
        };

        this.likes.push(like);

        // persist data in local storage
        this.persistData();

        return like;
    };

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        //[2,4,8] splice(1,2) => returns [4,8], original array mutates into [2,8]
        //[2,4,8] slice(1,2) => returns 4, original array doesn't mutate        
        this.likes.splice(index, 1); // this deletes the element from the array

        // persist data in local storage
        this.persistData();
    };

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    };

    getNumLikes() {
        return this.likes.length;
    };

    persistData() {
        console.log('here');
        localStorage.setItem('likes', JSON.stringify(this.likes));  
    };
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
};  
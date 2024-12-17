function Book(id, title, author, themes=[]){
    this.id = id;
    this.title = title;
    this.author = author;
    this.themes = themes
};
Book.prototype.addThemes = function(theme) {
    this.themes = [...this.themes, theme];
}

const book1 = new Book(1, "Harry Potter", "J.K. Rowling");
book1.addThemes('Fantasy');
book1.addThemes('Magic');
const book2 = new Book(2, "The Lord of the Rings", "J.R.R. Tolkien");
book2.addThemes('Fantasy');
book2.addThemes('Adventure');



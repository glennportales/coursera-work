const isAuth = true;
const user = {
  favorites: []
};

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  handleFavoriteProduct() {
    if (isAuth) {
      this.favoriteProduct();
    } else {
      console.log("You must be signed in to favorite products!");
    }
  }

  favoriteProduct() {
    user.favorites.push(this.name);
    console.log(`${this.name} favorited!`);
  }
}
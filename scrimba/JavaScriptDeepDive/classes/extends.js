class Product {
    constructor(name, price, discountable ){
        this.name = name;
        this.price = price;
        this.discountable = discountable;
    }    
    isDiscountable(){
        return this.discountable;
    }
}

class SaleProduct extends Product{
    constructor(name, price, discountable, percentOff){
        super(name, price, discountable);
        this.percentOff = percentOff;
    }
    getSalePrice(){
        if(super.isDiscountable()){
            return this.price * ((100 - this.percentOff) / 100);
        }
        else{
            return `${this.name} is not eligible for a discount`;
        }
    }
}

const product1 = new Product("Coffee Maker", 99, true, 20);
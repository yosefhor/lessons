//2
class BankAccount {
    constructor(public accountNumber: string, private balance: number) { }
    getBalance(): number {
        return this.balance
    }
}
//console.log(new BankAccount('54263-735674545', 7000).balance);

//3
class Vehicle {
    constructor(public brand: string, protected speed: number) { }
    move(): string {
        return `The vehicle is moving.`
    }
}
class Car extends Vehicle {
    constructor(brand: string, speed: number, public doors: number) { super(brand, speed) }
    honk(): string {
        return `Beep Beep!`
    }
}
console.log(new Car('BMW', 450, 3).honk());

//4
interface Shape {
    getArea(): number
}
class Rectangle implements Shape {
    constructor(public height: number, public width: number) { }
    getArea(): number {
        return this.height * this.width
    }
}
console.log(new Rectangle(2, 5).getArea());

//5
class MathUtils {
    static PI: number = 3.14;
    static circleArea(radius: number): number {
        return MathUtils.PI * (radius ** 2)
    }
}
console.log(MathUtils.circleArea(3));

//6
interface Printable {
    print(): string
}
class Product {
    constructor(public name: string, public price: number) { }
}
class Book extends Product implements Printable {
    constructor(public name: string, public price: number, public author: string) { super(name, price) }
    print(): string {
        return `Book: ${this.name}, Price: ${this.price}, Author: ${this.author}`
    }
}
console.log(new Book('Harry Potter', 90, 'J.K. Rowling').print());

//7
interface Book {
    name: string;
    price: number;
    author: string;
}
class Library {
    constructor(private books: Book[] = []) { }
    addBook(book: Book): void {
        this.books.push(book)
    }
    printAllBooks(): string[] {
        return this.books.map(book => book.print())
    }
}
const book1 = new Book('Harry Potter', 90, 'J.K. Rowling');
const book2 = new Book('Clean Code', 50, 'Robert C. Martin');
const book3 = new Book('You Don\'t Know JS', 40, 'Kyle Simpson');
const book4 = new Book('TypeScript Deep Dive', 60, 'Basarat Ali Syed');
const book5 = new Book('Effective TypeScript', 55, 'Dan Vanderkam');

const myLibrary = new Library()

myLibrary.addBook(book1)
myLibrary.addBook(book2)
myLibrary.addBook(book3)
myLibrary.addBook(book4)
myLibrary.addBook(book5)

console.log(myLibrary.printAllBooks());

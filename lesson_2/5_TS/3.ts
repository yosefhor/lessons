interface User {
   private id: number
    name: string
}

class UserAccount implements User {
    private id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
    greet(): string {
        return `Hi ${this.name}, your id is ${this.id} and you're always welcome`
    }
}

const myUser = new UserAccount()
export class UserDTO {
    constructor(newUser){
        this.firstName = newUser.firstName
        this.lastName  = newUser.lastName
        this.name  = `${newUser.firstName} ${newUser.lastName}`
        this.email      = newUser.email
        this.cartID = newUser.cartID
        this.id=newUser._id
        this.role=newUser.role
    }
}
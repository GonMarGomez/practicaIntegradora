export default class UserDTO {
    constructor (user){
        this.full_name = `${user.first_name} ${user.last_name}` ?? 'Unknown';
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart
    }
}
export default class UserDTO {
    constructor (user){
        this.full_name = `${user.first_name} ${user.last_name}` ?? 'Unknown';
        this.username = user.email;
        this.role = user.role;
        this.cartId = user.cart;
    }
}
const Address = require('./Address');
module.exports = class User{
    #name;
    #address;
    constructor(name,address){
        this.#name = name;
        this.#address = new Address(address);
    }
    getAddress(){
        return this.#address;
    }
    getName(){
        return this.#name;
    }
    setAddress(address){
        this.#address = new Address(address);
    }
}

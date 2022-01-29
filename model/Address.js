module.exports = class Address{
    #address;
    constructor(address){
        this.#address = address;
    }
    getStreetAddress(){
        return this.#address;
    }
}

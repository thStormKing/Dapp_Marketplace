// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract BasicMarketplace {
    
    // Struct datatype to store the items
    struct Product{
        uint256 id;
        string itemName;
        address creator;
        address owner;
        uint256 askingPrice;
        bool isSold;
    }

    // This will keep track of the Product struct and the prices
    mapping(uint256=>Product) public products;
    
    // Give a unique id to a product on creation
    uint256 public numProduct;

    event savingsEvent(uint256 indexed _productId);

    constructor() {
        numProduct = 0;
        addProduct("Product 1",100);
    }

    function addProduct(string memory itemName, uint256 askingPrice) public{
        Product storage p = products[numProduct];
        p.creator = msg.sender;
        p.owner = msg.sender;
        p.askingPrice = askingPrice;
        p.itemName = itemName;
        p.isSold = false;

        products[numProduct] = Product(
            numProduct,
            p.itemName,
            p.creator,
            p.owner,
            p.askingPrice,
            p.isSold
        );

        numProduct++;
    }

    function getProduct(uint256 productId) public view returns(Product memory){
        return products[productId];
    }

    function getProducts() public view returns(Product[] memory){
        Product[] memory prodlist = new Product[](numProduct);
        for(uint256 i=0; i<numProduct; i++){
            Product storage product = products[i];
            prodlist[i] = product;
        }

        return prodlist;
    }

    function sellProduct(uint256 productId) public {
        Product storage p = products[productId];
        p.owner = msg.sender;
        p.isSold = true;
    }
}
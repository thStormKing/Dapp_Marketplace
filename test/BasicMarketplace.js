const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("BasicMarketplace",function(){
    
    it("Should return a new product once deployed", async function(){
        const Contract = await ethers.getContractFactory("BasicMarketplace");
        const contract = await Contract.deploy();
        await contract.deployed();

        expect(await contract.numProduct()).to.equal(1);
    });

    it("Should add a new product",async function(){
        const Contract = await ethers.getContractFactory("BasicMarketplace");
        const contract = await Contract.deploy();
        await contract.deployed();

        const addProductTx = await contract.addProduct("Test Product",100);
        await addProductTx.wait();

        expect(await contract.numProduct()).to.equal(2);
    });

})
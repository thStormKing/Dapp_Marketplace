App = {
    contract: {},
    init: async function(){
        console.log("init is called");

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts",[]);
        const signer = await provider.getSigner();
        
        let userAddress = await signer.getAddress();

        document.getElementById("wallet").innerText="Your wallet address is: "+userAddress;

        const resourceAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

        $.getJSON("../artifacts/contracts/BasicMarketplace.sol/BasicMarketplace.json", 
        function(BasicMarketplaceArtifact){
            const contract = new ethers.Contract(
                resourceAddress,
                BasicMarketplaceArtifact.abi,
                signer
            );

            App.contract = contract;

            contract.getProducts().then((data)=>{
                // console.log(data);
                var allItemsDiv = $("#addItems");
                var itemTemplate = $("#itemTemplate");
                for(i=0; i<data.length;i++){
                itemTemplate.find(".itemName").text(data[i].itemName);
                itemTemplate.find(".itemOwner").text(data[i].owner);
                itemTemplate.find(".itemCreator").text(data[i].creator);
                itemTemplate.find(".askingPrice").text(data[i].askingPrice);
                
                itemTemplate
                    .find(".itemStatus")
                    .text(data[i].isSold?"Sold":"Available");
                
                itemTemplate.find(".buy_btn").attr("data-id",data[i].id);
                if(data[i].isSold){
                    itemTemplate.find(".buy_btn").hide();
                } else {
                    itemTemplate.find(".buy_btn").show();
                }
                allItemsDiv.append(itemTemplate.html());
            }
            });
        });
        // console.log("Returning bind events");
        return App.bindEvents();
    },

    bindEvents: function(){
        $(document).on("click", ".btn_add", App.handleAdd);
        $(document).on("click", ".buy_btn", {id: this.id}, App.handleBuy);
    },

    handleAdd: function(){
        console.log("Handling add item.");
        var newitemName = $("#new_itemName").val();
        var newaskingprice = $("#new_askingprice").val();
        // console.log(newitemName,newaskingprice);
        App.contract.addProduct(newitemName,newaskingprice);
    },

    handleBuy: function(event){
        var productId = parseInt($(event.target).data("id"));
        console.log(productId);
        App.contract.sellProduct(productId);
    }
}

$(function (){
    $(window).load(function(){
        App.init();
    });
});
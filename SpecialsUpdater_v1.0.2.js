(function(){
    function getSpecialData(event){
		var $target = event;
		var SpecialData = [
			{	
				Title: $target.find(".Bravura_Title").text(), 
				href: $target.find(".Bravura_ImgHref").attr("href"),
				imgSrc: $target.find(".Bravura_Img").attr("src").split(".jpg")[0],
				btnHref:$target.find("Bravura_BtnHref").attr("href"),
				askingPrice: $target.find(".Bravura_AskingPrice").text(),
				wasPrice: $target.find(".Bravura_WasPrice").text(),
				stockNum: $target.find(".Bravura_StockNum").text(),
				vin: $target.find(".Bravura_VIN").text(),
				features: $target.find(".Bravura_Features").text()
			}
		];
		return SpecialData;
    }

    function queryInventory(href){
		var inventoryURL = href;
		var results = [];
		try{
			$.ajax({
				url:inventoryURL,
				type:'GET',
				async: false,
				success: function(response){
					var InventoryData = [
						{	
							Title: $(response).find(".ddc-page-title").text(), 
							imgSrc: $(response).find("#photos").find(".photo").attr("src").split(".jpg")[0],
							askingPrice: $(response).find(".final-price").find(".price").text(),
							stockNum: $(response).find(".stockNumber").find(".value").text(),
							vin: $(response).find(".vin").find(".value").text(),
							features: $(response).find("#highlighted-features").find("ul")
						}
					];
					results = InventoryData;
					},
				error: function () {}
			});
		}
		catch(e){
			// console.log("$ error in AJAX");
		}
		return results;
    }

    function buildNewSpecial(newInvData, fullHref){
    	specialCode = $(".b-container").clone();
    	specialCode.find(".Bravura_Title").text(newInvData[0].Title);
		specialCode.find(".Bravura_ImgHref").attr("href",fullHref);
		specialCode.find(".Bravura_Img").attr("src", newInvData[0].imgSrc);
		specialCode.find(".Bravura_AskingPrice").text(newInvData[0].askingPrice);
		specialCode.find(".Bravura_StockNum").text(newInvData[0].stockNum);
		specialCode.find("Bravura_BtnHref").attr("href", fullHref);

		if(specialCode.find(".Bravura_WasPrice")){
			specialCode.find(".Bravura_WasPrice").text(calcWasPrice(newInvData[0].askingPrice))
		}else{}

		if(specialCode.find(".Bravura_VIN")){
			specialCode.find(".Bravura_VIN").text(newInvData[0].vin);
		}else{}

		if(specialCode.find(".Bravura_Features")){
			specialCode.find(".Bravura_Features").text(newInvData[0].features);
		}else{}
		return specialCode;
    }  

    function calcWasPrice(string){
		var oldWasPrice = string.split('$')[1];
		var thousands = oldWasPrice.split(',')[0]*1000;
		var hundreds = oldWasPrice.split(',')[1];
		var newWasPrice = eval(thousands)+eval(hundreds)+500;
		newWasPrice = 'Was: $'+newWasPrice.toLocaleString();
		return newWasPrice;
    }
    

	$('body').prepend('<div id="modalModule"><style>.modalWindow{background:rgba(0,0,0,0.8);position:fixed;top:0;right:0;bottom:0;left:0;z-index:100}.modalWrapper{position:absolute;width:100%;height:100%;z-index:200}.modalContainer{position:relative;margin:10%;width:auto;height:auto;max-height:75%;overflow:auto;background-color:white}.modalHead{display:block}.modalH1{margin-left:5px;font-size:44px}.closeModal{float:right;font-size:24px;margin:5px 5px 0px 0px;padding:5px 10px 5px 10px;background-color:#ef796b;cursor:pointer;color:white}.modalTextArea{width:95%}.modalBodyItem{padding-top:10px;padding-bottom:10px;margin:0px 5px 10px 5px}.modalInput{width:75%;display:inline}.modalBtn{display:inline;padding:3px 12px 3px 12px;border:solid,2px,#68d1bc;background-color:#a3e2cd;cursor:pointer;margin-right:10px}.noPriceChange{padding:5px 10px 5px 10px;background-color:#c7e8dd}.priceChanged{padding:5px 10px 5px 10px;background-color:#ffe0ad}.invSold{padding:5px 10px 5px 10px;background-color:#efbdb8}</style><div class="modalWindow"><div class="modalWrapper"><div class="modalContainer"><div class="modalHead"> <span class="modalH1">Specials Checks</span> <span class="closeModal">x</span></div><hr><div class="modalBody"></div></div></div></div></div>');

	//close click event
	$('.closeModal').click(function(){
		$('#modalModule').remove();
	});

	
		

    $(".b-container").each(function(i){
		var spData = getSpecialData($(this));
		var invHREF = ".." + spData[0].href.split(".com")[1];
		var invData = queryInventory(invHREF);

		if(invData.length > 0){
			if(spData[0].askingPrice == invData[0].askingPrice){
				$('.modalBody').append('<div class="modalBodyItem noPriceChange" id="modalBodyItem'+(i+1)+'"><p>' + (i+1) + ': No change in price.</p></div>');			}
			else if(spData[0].askingPrice != invData[0].askingPrice){
				if($(this).find('.Bravura_WasPrice')){
					var newCode = $(this);
					newCode.find('.Bravura_AskingPrice').text(invData[0].askingPrice);
					newCode.find('.Bravura_WasPrice').text(calcWasPrice(invData[0].askingPrice));
					$('.modalBody').append('<div class="modalBodyItem priceChanged" id="modalBodyItem'+(i+1)+'"><p>' + (i+1) + ': Price change to ' + invData[0].askingPrice + '</p><textarea class="modalTextArea">' + $('.b-container').parent().get(0).innerHTML.split('<div class="b-container">')[0] + newCode.html() + '</textarea></div>');
				}else{}
			}
			else{
				console.log('ERROR: Unable to compare vehicle price.');
			}
		}
		else{
			$('.modalBody').append('<div class="modalBodyItem invSold" id="modalBodyItem'+(i+1)+'"><p>' + (i+1) + ': SOLD!</p><span class="modalBtn" id="modalBtn'+(i+1)+'">Use</span><input class="modalInput" id="modalItem'+(i+1)+'"></input></div>');
			
			//new special click event
			$('#modalBtn'+(i+1)).click(function(){
				var inputHref = $('#modalBtn'+(i+1)).next().val();
				var relHref =  ".." + inputHref.split(".com")[1];
				var newHrefData = queryInventory(relHref);
				var newSpBuild = buildNewSpecial(newHrefData,inputHref).html();
				$('#modalItem'+(i+1)).after('<textarea class="modalTextArea style="margin-top:5px;">'+$('.b-container').parent().get(0).innerHTML.split('<div class="b-container">')[0]+'<div class="b-container">'+newSpBuild+'</div></textarea>');
			});
		}
	});
})();

handlers.endGame=function(c,k){var a="01",e="0";"rWin"==c.outcome&&(e="1");var b=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=b.Statistics.length&&(a=b.Statistics[0].Value.toString(),log.debug("wlStat "+a));var f=0,l;log.debug("wlStat.length "+a.length);if(50>a.length){a+=e;l=a.length;for(b=0;b<a.length;b++)"1"==a[b]&&f++;log.debug("wlStatNew "+a)}else{l=a.length;for(b=0;b<a.length-1;b++)a[b]=a[b+1],"1"==a[b]&&f++;a[a.length-1]=e;"1"==e&&f++;log.debug("wlStatNewMoreThanMax "+
a)}e=Math.round(f/l*100);log.debug("winRatio "+e);b=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});l=0;f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=f.Statistics.length&&(l=f.Statistics[0].Value);f=l;"rWin"==c.val&&(l=0>=l?30:l+60);var g=[];g.push({StatisticName:"WinLoss",Version:"0",Value:a});g.push({StatisticName:"TrophyCount",Version:"0",Value:l});if("rOot"!=c.val){a=JSON.parse(b.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+
a);for(var d,b=0;b<a.subdivisions.length;b++)if(f<a.subdivisions[b]){d=b;break}log.debug("user is in subdivision "+d);a=[];a.push({Key:c.envIndex+"_"+c.courseIndex+"_RecPos",Value:c.recordingPos});a.push({Key:c.envIndex+"_"+c.courseIndex+"_RecRot",Value:c.recordingRot});a.push({Key:c.envIndex+"_"+c.courseIndex+"_RecHeader",Value:c.recordingHeader});log.debug("updating user read only data ");b=server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:a});log.debug("updated user read only data for "+
currentPlayerId+" "+b);b=server.GetTitleInternalData({Key:"RecSubDivision"+d}).Data["RecSubDivision"+d];log.debug("recPool: "+b);if(void 0==b)f=[],e={wl:e,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId},f.push(e),b=JSON.stringify(f),log.debug("recArray: "+b);else{f=JSON.parse(b);log.debug("recArray: "+f);e={wl:e,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId};l=!1;for(b=0;b<f.length;b++)if(f[b].e==c.envIndex&&f[b].c==c.courseIndex){l=!0;f[b]=e;if(1==f.length)break;if(0<b)if(f[b].wl>f[b-1].wl){if(b==
f.length-1)break;for(g=b+1;g<f.length;g++)if(f[g-1].wl>f[g].wl){var h=f[g];f[g]=f[g-1];f[g-1]=h}else break}else for(g=b-1;0<=g;g--)if(f[g+1].wl<f[g].wl)h=f[g],f[g]=f[g+1],f[g+1]=h;else break;else for(g=b+1;g<f.length;g++)if(f[g-1].wl>f[g].wl)h=f[g],f[g]=f[g-1],f[g-1]=h;else break}0==l&&(log.debug("recArrayLNbefore: "+f.length),f.push(e),log.debug("recArrayLNafter: "+f.length));b=JSON.stringify(f);log.debug("titleKeyVal: "+b)}server.SetTitleInternalData({Key:"RecSubDivision"+d,Value:b});return{dicVal:a}}};
handlers.startGame=function(c,k){var a;a=50;var e,b=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=b.Statistics.length){a=b.Statistics[0].Value.toString();log.debug("wlStat "+a);e=a.length;for(b=0;b<a.length;b++)"1"==a[b]&&wins++;a=Math.round(wins/e*100)}var b=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});e=0;0!=f.Statistics.length&&(e=f.Statistics[0].Value);
f=JSON.parse(b.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+f);for(var l,b=0;b<f.subdivisions.length;b++)if(e<f.subdivisions[b]){l=b;break}log.debug("user is in subdivision "+l);b=server.GetTitleInternalData({Keys:"RecSubDivision"+l}).Data["RecSubDivision"+l];log.debug("recPool "+b);if(void 0==b)return generateErrObj("Recording pool for this subdivision is null");log.debug("parsing to json array");var g=JSON.parse(b),f=g[g.length-1].uId;l=g[g.length-1].e;e=g[g.length-1].c;for(b=
0;b<g.length;b++)if(a<g[b].wl){f=g[b].uId;l=g[b].e;e=g[b].c;break}a=[l+"_"+e+"_RecPos",l+"_"+e+"_RecRot",l+"_"+e+"_RecHeader"];log.debug("requesting "+a);a=server.GetUserReadOnlyData({PlayFabId:f,Keys:a});if(void 0==a)return generateErrObj("Did not find recording for this user: "+f);b=server.GetPlayerCombinedInfo({PlayFabId:f,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,
GetTitleData:!1,GetPlayerStatistics:!1}});return{Result:"OK",PosData:a.Data[l+"_"+e+"_RecPos"].Value,RotData:a.Data[l+"_"+e+"_RecRot"].Value,HeaderData:a.Data[l+"_"+e+"_RecHeader"].Value,Opp:b.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(c,k){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==c.val&&(a-=30);0>a&&(a=0);"rWin"==c.val&&(a+=60);if("rLose"==c.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==c.val)return{val:a}};
handlers.initServerData=function(c){c=[];var k={StatisticName:"TrophyCount",Version:"0",Value:"0"};c.push(k);k={StatisticName:"League",Version:"0",Value:"0"};c.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});c=[];c.push("Decals");c.push("PaintJobs");c.push("Plates");c.push("Rims");c.push("WindshieldText");c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c});for(var k={0:"Owned"},a=0;a<c.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[a].ItemInstanceId,Data:k});c=[];c.push("FordFocus");c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});k={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:k});k={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:k});k={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:k});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(c){c=server.GetUserInventory({PlayFabId:currentPlayerId});for(var k=0;k<c.Inventory.length;k++)if("CarsProgress"==c.Inventory[k].CatalogVersion){log.debug("found "+c.Inventory[k].ItemId);c.Inventory[k].CustomData.Pr=recalculateCarPr(c.Inventory[k].CustomData,c.Inventory[k].ItemId);var a={};a.Pr=c.Inventory[k].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[k].ItemInstanceId,Data:a})}return c};
function generateFailObj(c){return{Result:"Failed",Message:c}}function generateErrObj(c){return{Result:"Error",Message:c}}function checkBalance(c,k,a,e){if("SC"==c){if(a<k)return generateFailObj("NotEnoughSC")}else if(e<k)return generateFailObj("NotEnoughHC");return"OK"}
function recalculateCarPr(c,k){for(var a=0,e=server.GetCatalogItems({CatalogVersion:"CarCards"}),b=0;b<e.Catalog.length;b++)if(e.Catalog[b].ItemId==k){b=JSON.parse(e.Catalog[b].CustomData);a+=parseInt(b.basePr)+parseInt(b.prPerLvl)*(parseInt(c.CarLvl)-1);break}for(var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),f={Exhaust:c.ExhaustLvl,Engine:c.EngineLvl,Gearbox:c.GearboxLvl,Suspension:c.SuspensionLvl,Tires:c.TiresLvl,Turbo:c.TurboLvl},l,b=0;b<e.Catalog.length;b++)l=JSON.parse(e.Catalog[b].CustomData),
a+=parseInt(l.basePr)+parseInt(l.prPerLvl)*f[e.Catalog[b].ItemId];return a}
function GenerateBlackMarket(c){var k=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*k.Catalog.length),b=JSON.parse(k.Catalog[e].CustomData);if(void 0==b)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");a.BMItem0=k.Catalog[e].ItemId+"_"+b.BMCurrType+"_"+b.BMbasePrice+"_0_"+b.BMpriceIncrPerBuy;var f=Math.floor(Math.random()*k.Catalog.length);f==e&&(f=k.Catalog.length-e-1);b=JSON.parse(k.Catalog[f].CustomData);
if(void 0==b)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");a.BMItem1=k.Catalog[f].ItemId+"_"+b.BMCurrType+"_"+b.BMbasePrice+"_0_"+b.BMpriceIncrPerBuy;for(var k=server.GetCatalogItems({CatalogVersion:"CarCards"}),b=[],f=[],l=0;l<k.Catalog.length;l++){e=JSON.parse(k.Catalog[l].CustomData);if(void 0==e)return generateErrObj("Car card "+k.Catalog[l].ItemId+" has no custom data.");"false"==e.rareCar?b.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):
f.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}0>=b.length?(a.BMItem2=f[Math.floor(Math.random()*f.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]):0>=f.length?(a.BMItem2=b[Math.floor(Math.random()*b.length)],a.BMItem3=b[Math.floor(Math.random()*b.length)]):(a.BMItem2=b[Math.floor(Math.random()*b.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]);server.UpdateUserInternalData({PlayFabId:c,Data:a});l=[];l.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:c,
Keys:l});a.BMTime=60*parseInt(c.Data.BlackMarketResetMinutes);return a}function GetCurrentBlackMarket(c,k){var a={},e=new Date,b=[];b.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:c,Keys:b});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-k.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=k.Data["BMItem"+e].Value;return a}
handlers.purchaseBMItem=function(c,k){log.debug("purchasing item "+c.itemId+" from black market");if(0>c.itemId||3<c.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+c.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+c.itemId].Value.split("_");log.debug("userArray: "+a);var b=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var f;f=2>c.itemId?"PartCards":"CarCards";var l=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),b=checkBalance(a[1],l,b,b);if("OK"!=b)return b;var g,d;log.debug("searching for: "+a[0]+" in "+f);for(b=0;b<e.Inventory.length;b++)if(e.Inventory[b].ItemId==a[0]&&e.Inventory[b].CatalogVersion==f){log.debug("found it!");g=e.Inventory[b].ItemInstanceId;void 0==e.Inventory[b].CustomData?(log.debug("no custom data. creating ..."),d={Amount:1}):void 0==e.Inventory[b].CustomData.Amount?d={Amount:1}:(d=Number(e.Inventory[b].CustomData.Amount)+
1,isNaN(d)&&(d=1),d={Amount:d});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:d});break}void 0==g&&(log.debug("cardInstance is undefined"),g=[],g.push(a[0]),g=server.GrantItemsToUser({CatalogVersion:f,PlayFabId:currentPlayerId,ItemIds:g}).ItemGrantResults[0].ItemInstanceId,void 0==g?generateErrObj("grantRequest denied"):(d={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:d})));g=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:a[1],Amount:l});l=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+l);e={};e["BMItem"+c.itemId]=l;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});d=[{ItemId:a[0],CatalogVersion:f,CustomData:d}];f={};f[g.VirtualCurrency]=g.Balance;a=c.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];b={Inventory:d,VirtualCurrency:f};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:b,BMItemChange:a}};
handlers.retrieveBlackMarket=function(c,k){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);e=new Date;log.debug("milliseconds passed: "+e.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var b=[];b.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:currentPlayerId,Keys:b});if(e.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(b.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(c,k){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],b="-1",f={},l={PaintJobs:{itemOwned:"no",itemCustData:c.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:c.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:c.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:c.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:c.wsId,carItemId:"WindshieldId"}},g=0;g<a.Inventory.length;g++)a.Inventory[g].ItemId==
c.carId&&"CarsProgress"==a.Inventory[g].CatalogVersion&&(b=a.Inventory[g].ItemInstanceId),a.Inventory[g].ItemId in l&&(l[a.Inventory[g].ItemId].itemOwned="yes",l[a.Inventory[g].ItemId].itemCustData in a.Inventory[g].CustomData?f[l[a.Inventory[g].ItemId].carItemId]=l[a.Inventory[g].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[g].ItemId+" "+l[a.Inventory[g].ItemId].itemCustData));if("-1"==b)return generateFailObj("User does not own car with id: "+c.carId);for(var d in l)l.hasOwnProperty(d)&&
"no"==l[d].itemOwned&&e.push(d);if(f=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:f});a=[{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:f}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),b={0:"Owned"},g=0;g<e.ItemGrantResults.length;g++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[g].ItemInstanceId,Data:b});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(c,k){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,b=a.VirtualCurrency.HC;log.debug("user currency: SC: "+e+" HC: "+b);switch(c.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+c.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),l=!1,g,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==c.carId&&"CarsProgress"==
a.Inventory[d].CatalogVersion){l=!0;log.debug("car is in user's inventory!");g=a.Inventory[d];break}for(var h,d=0;d<f.Catalog.length;d++)if(f.Catalog[d].ItemId==c.carId){h=JSON.parse(f.Catalog[d].CustomData);log.debug("cardInfo found!");break}if(void 0==h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+c.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==l){log.debug("user has car: "+c.carId+
"... upgrading");f=parseInt(h.baseCurrCost)+parseInt(g.CustomData.CarLvl)*parseInt(h.currCostPerLvl);b=checkBalance(h.currType,f,e,b);if("OK"!=b)return b;log.debug("user has enough currency. Let's check for card balance");b=parseInt(h.baseCardCost)+parseInt(g.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);log.debug("cardCost: "+b);for(var q=!1,p,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==c.carId&&"CarCards"==a.Inventory[d].CatalogVersion){log.debug("consuming: "+a.Inventory[d].ItemInstanceId);
q=!0;try{if(void 0==a.Inventory[d].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0==a.Inventory[d].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(a.Inventory[d].CustomData.Amount>=b)a.Inventory[d].CustomData.Amount-=b,p={Amount:a.Inventory[d].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,Data:p});else return generateFailObj("Insufficient cards for real: "+
a.Inventory[d].CustomData.Amount+" vs "+b)}catch(t){return log.debug("itemConsumptionResult.errorCode "+t),generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase upgrade!");d=parseInt(g.CustomData.CarLvl)+1;a=recalculateCarPr(g.CustomData,g.ItemId);log.debug("upgrading to car lvl: "+d+" and pr: "+a);d={CarLvl:d,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,
Data:d});var m;0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:f}));log.debug("Upgrade Complete!");a=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:d}];h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:d}}else{log.debug("user doesn't have car: "+c.carId+"... looking for card");for(var q=
!1,r,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==c.carId&&"CarCards"==a.Inventory[d].CatalogVersion){log.debug("consuming: "+a.Inventory[d].ItemInstanceId);q=!0;try{if(void 0==a.Inventory[d].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==a.Inventory[d].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(a.Inventory[d].CustomData.Amount>=h.baseCardCost)r=a.Inventory[d].ItemInstanceId,a.Inventory[d].CustomData.Amount-=
h.baseCardCost,p={Amount:a.Inventory[d].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[d].CustomData.Amount+" vs "+h.baseCardCost+".")}catch(t){return generateFailObj("Insufficient cards: "+t)}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");b=checkBalance(h.currType,h.baseCurrCost,e,b);if("OK"!=b)return b;d=[];d.push(c.carId);b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",
PlayFabId:currentPlayerId,ItemIds:d});if(0==b.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:r,Data:p});0<h.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:h.baseCurrCost}));d={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",
GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:d});d={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:d});d={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,
Data:d});g=b=!1;for(var n,d=0;d<a.Inventory.length;d++)if("PaintJobs"==a.Inventory[d].ItemId){g=!0;log.debug("user has paintjobs");void 0!=a.Inventory[d].CustomData?(log.debug("user has paintjobs customData"),h.defaultPaintID in a.Inventory[d].CustomData?(log.debug("user has paintjob already"),b=!0):(log.debug("user doesn't have paintjob"),n={},n[h.defaultPaintID]="Owned")):(n={},n[h.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,
Data:n});break}0==g&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:n}));d={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:h.basePr};a=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:d}];0==b&&(d={},d[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:d}));h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:d}}return h;case "partUpgrade":log.debug("Upgrading Part: "+c.partId+" on Car: "+c.carId);log.debug("Checking to see if car exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"CarsProgress"});n=!1;for(d=0;d<p.Catalog.length;d++)if(p.Catalog[d].ItemId==c.carId){n=!0;break}if(0==n)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+c.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");p=server.GetCatalogItems({CatalogVersion:"PartCards"});n=!1;for(d=0;d<p.Catalog.length;d++)if(p.Catalog[d].ItemId==c.partId){h=JSON.parse(p.Catalog[d].CustomData);n=!0;break}if(0==n)return log.error("invalid part ID"),
h={Result:"Error",Message:"part with ID: "+c.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+c.carId);l=!1;for(d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==c.carId&&"CarsProgress"==a.Inventory[d].CatalogVersion){l=!0;log.debug("car is in user's inventory!");g=a.Inventory[d];break}if(0==l)return generateFailObj("car with ID: "+c.carId+" not found in user inventory.");log.debug("Checking to see if user has part and or has enough parts");p=!1;for(d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==
c.partId&&"PartCards"==a.Inventory[d].CatalogVersion){p=!0;log.debug("part is in user's inventory!");q={};r={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+c.partId+" cost and modifying "+r[c.partId]);n=parseInt(h.baseCardCost)+parseInt(g.CustomData[r[c.partId]])*parseInt(h.cardCostPerLvl);f=parseInt(h.baseCurrCost)+parseInt(g.CustomData[r[c.partId]])*parseInt(h.currCostPerLvl);l=parseInt(g.CustomData[r[c.partId]])+
1;q[r[c.partId]]=l;g.CustomData[r[c.partId]]=l;log.debug("we need: "+n+" cards");var v,b=checkBalance(h.currType,f,e,b);if("OK"!=b)return b;log.debug("consuming part instance: "+a.Inventory[d].ItemInstanceId);try{if(void 0!=a.Inventory[d].CustomData&&void 0!=a.Inventory[d].CustomData.Amount&&a.Inventory[d].CustomData.Amount>=n)a.Inventory[d].CustomData.Amount-=n,v={Amount:a.Inventory[d].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,
Data:v});else return generateFailObj("Insufficient cards")}catch(t){return log.debug("itemConsumptionResult.errorCode "+t),generateFailObj("Insufficient cards")}break}if(0==p)return generateFailObj("Part not found");0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:f}));a=recalculateCarPr(g.CustomData,g.ItemId);q.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,Data:q});a=[{ItemId:c.partId,
CatalogVersion:"PartCards",CustomData:v},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:q}];log.debug("succesfully upgraded part!");h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);return h={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:d};case "custPurchase":log.debug("Purchasing Customization: "+c.custId+" with val: "+c.custVal);log.debug("Checking to see if customization exists in catalog");g=server.GetCatalogItems({CatalogVersion:"Customization"});
var w;h=0;m="SC";for(d=0;d<g.Catalog.length;d++)if(g.Catalog[d].ItemId==c.custId){w=g.Catalog[d];h=JSON.parse(g.Catalog[d].CustomData);d=c.custVal+",Cost";m=h[c.custVal+",Curr"];h=h[d];b=checkBalance(m,h,e,b);if("OK"!=b)return b;log.debug("custCurr: "+m);log.debug("custPrice: "+h);break}if(void 0==w)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");for(var u,
d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==c.custId){log.debug("user has customization category!");u=a.Inventory[d];l=a.Inventory[d].ItemInstanceId;if(void 0!=u.CustomData&&String(c.custVal)in u.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==u){log.info("user doesn't have customization category. Granting ... ");d=[];d.push(c.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:d});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),
h={Result:"Error",Message:"something went wrong while granting user customization class object."};l=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(c.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l,Data:a});a=[{ItemId:c.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:h}),h={},h[m.VirtualCurrency]=m.Balance,d={Inventory:a,VirtualCurrency:h}):d=
{Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:d};case "softCurrencyPurchase":log.debug("Purchasing pack: "+c.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(d=g=0;d<m.Catalog.length;d++)if(m.Catalog[d].ItemId==c.packId){g=m.Catalog[d].VirtualCurrencyPrices.HC;h=JSON.parse(m.Catalog[d].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+
c.packId+" not found in catalog."};if(0>=g)return h={Result:"Error",Message:"pack with ID: "+c.packId+" shouldn't have negative cost."};if(g>b)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:g});a=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:h.quantity});h={};h[a.VirtualCurrency]=a.Balance;h[m.VirtualCurrency]=m.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",
InventoryChange:{VirtualCurrency:h}};default:log.debug("invalid purchase parameter")}};handlers.giveMoney=function(c){c=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.amount});var k={};k[c.VirtualCurrency]=c.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:k}}};
handlers.grantItems=function(c){for(var k=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,b=0;b<k.Inventory.length;b++)if(k.Inventory[b].ItemId==c.itemId&&k.Inventory[b].CatalogVersion==c.catalogId){log.debug("adding amount to: "+k.Inventory[b].ItemInstanceId);a=void 0==k.Inventory[b].CustomData?c.amount:void 0==k.Inventory[b].CustomData.Amount?c.amount:isNaN(Number(k.Inventory[b].CustomData.Amount))?c.amount:Number(k.Inventory[b].CustomData.Amount)+c.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k.Inventory[b].ItemInstanceId,Data:a});e=!0;break}0==e&&(k=[],k.push(c.itemId),k=server.GrantItemsToUser({CatalogVersion:c.catalogId,PlayFabId:currentPlayerId,ItemIds:k}),a={Amount:c.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:c.itemId,CatalogVersion:c.catalogId,CustomData:a}]}}};
handlers.openChest=function(c,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<c.currCost){if("OK"!=checkBalance(c.currType,c.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.currType,Amount:c.currCost})}for(var e in c.currencyReq)0<c.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e,Amount:c.currencyReq[e]});var b;
for(e in c.carCardsRequest)if(log.debug(e+" : "+c.carCardsRequest[e]),c.carCardsRequest.hasOwnProperty(e)){b=!1;log.debug("looking for: "+e);for(var f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"CarCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);b=void 0==a.Inventory[f].CustomData?Number(c.carCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(c.carCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(c.carCardsRequest[e]):
Number(a.Inventory[f].CustomData.Amount)+Number(c.carCardsRequest[e]);b={Amount:b};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:b});b=!0;break}0==b&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:f}),b={Amount:c.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:b}))}for(e in c.partCardsRequest)if(log.debug(e+
" : "+c.partCardsRequest[e]),c.partCardsRequest.hasOwnProperty(e)){b=!1;log.debug("looking for: "+e);for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"PartCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);b=void 0==a.Inventory[f].CustomData?Number(c.partCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(c.partCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(c.partCardsRequest[e]):Number(a.Inventory[f].CustomData.Amount)+
Number(c.partCardsRequest[e]);b={Amount:b};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:b});b=!0;break}0==b&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:f}),b={Amount:c.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:b}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.buyChest=function(c,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(c.curr,c.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.cost}),e={};e[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:e}}};handlers.getServerTime=function(c,k){return{time:new Date}};

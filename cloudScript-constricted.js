handlers.endGame=function(a,k){var b="01",e="0";"rWin"==a.outcome&&(e="1");var d=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=d.Statistics.length&&(b=d.Statistics[0].Value.toString(),log.debug("wlStat "+b));var f=0,l;log.debug("wlStat.length "+b.length);if(50>b.length){b+=e;l=b.length;for(d=0;d<b.length;d++)"1"==b[d]&&f++;log.debug("wlStatNew "+b)}else{l=b.length;for(d=0;d<b.length-1;d++)b[d]=b[d+1],"1"==b[d]&&f++;b[b.length-1]=e;"1"==e&&f++;log.debug("wlStatNewMoreThanMax "+
b)}e=Math.round(f/l*100);log.debug("winRatio "+e);d=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});l=0;f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=f.Statistics.length&&(l=f.Statistics[0].Value);f=l;"rWin"==a.val&&(l=0>=l?30:l+60);var h=[];h.push({StatisticName:"WinLoss",Version:"0",Value:b});h.push({StatisticName:"TrophyCount",Version:"0",Value:l});if("rOot"!=a.val){b=JSON.parse(d.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+
b);for(var c,d=0;d<b.subdivisions.length;d++)if(f<b.subdivisions[d]){c=d;break}log.debug("user is in subdivision "+c);b=[];b.push({Key:a.envIndex+"_"+a.courseIndex+"_RecPos",Value:a.recordingPos});b.push({Key:a.envIndex+"_"+a.courseIndex+"_RecRot",Value:a.recordingRot});b.push({Key:a.envIndex+"_"+a.courseIndex+"_RecHeader",Value:a.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:b});d=server.GetTitleInternalData({Key:"RecSubDivision"+c}).Data["RecSubDivision"+c];log.debug("recPool: "+
d);if(void 0==d)f=[],e={wl:e,e:a.envIndex,c:a.courseIndex,uId:currentPlayerId},f.push(e),d=JSON.stringify(f),log.debug("recArray: "+d);else{f=JSON.parse(d);log.debug("recArray: "+f);e={wl:e,e:a.envIndex,c:a.courseIndex,uId:currentPlayerId};l=!1;for(d=0;d<f.length;d++)if(f[d].e==a.envIndex&&f[d].c==a.courseIndex){l=!0;f[d]=e;if(1==f.length)break;if(0<d)if(f[d].wl>f[d-1].wl){if(d==f.length-1)break;for(h=d+1;h<f.length;h++)if(f[h-1].wl>f[h].wl){var g=f[h];f[h]=f[h-1];f[h-1]=g}else break}else for(h=d-
1;0<=h;h--)if(f[h+1].wl<f[h].wl)g=f[h],f[h]=f[h+1],f[h+1]=g;else break;else for(h=d+1;h<f.length;h++)if(f[h-1].wl>f[h].wl)g=f[h],f[h]=f[h-1],f[h-1]=g;else break}0==l&&(log.debug("recArrayLNbefore: "+f.length),f.push(e),log.debug("recArrayLNafter: "+f.length));d=JSON.stringify(f);log.debug("titleKeyVal: "+d)}server.SetTitleInternalData({Key:"RecSubDivision"+c,Value:d});return{dicVal:b}}};
handlers.requestSplitPlayerRecording=function(a,k){for(var b=server.GetTitleInternalData({Keys:"Rec_"+a.envIndex+"_"+a.courseIndex}).Data["Rec_"+a.envIndex+"_"+a.courseIndex].split(","),e=b[0],d=0;d<b.length;d++)if(b[d]!=currentPlayerId){e=b[d];break}b=server.GetUserReadOnlyData({PlayFabId:e,Keys:["RecPos_"+a.envIndex+"_"+a.courseIndex,"RecRot_"+a.envIndex+"_"+a.courseIndex,"RecHeader_"+a.envIndex+"_"+a.courseIndex]});e=server.GetPlayerCombinedInfo({PlayFabId:e,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}});return{PosData:b.Data["RecPos_"+a.envIndex+"_"+a.courseIndex].Value,RotData:b.Data["RecRot_"+a.envIndex+"_"+a.courseIndex].Value,HeaderData:b.Data["RecHeader_"+a.envIndex+"_"+a.courseIndex].Value,Opp:e.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(a,k){var b=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(b=e.Statistics[0].Value);"rStart"==a.val&&(b-=30);0>b&&(b=0);"rWin"==a.val&&(b+=60);if("rLose"==a.val)return{val:b};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:b});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==a.val)return{val:b}};
handlers.initServerData=function(a){a=[];var k={StatisticName:"TrophyCount",Version:"0",Value:"0"};a.push(k);k={StatisticName:"League",Version:"0",Value:"0"};a.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a=[];a.push("Decals");a.push("PaintJobs");a.push("Plates");a.push("Rims");a.push("WindshieldText");a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:a});for(var k={0:"Owned"},b=0;b<a.ItemGrantResults.length;b++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.ItemGrantResults[b].ItemInstanceId,Data:k});a=[];a.push("FordFocus");a=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:a});k={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:k});k={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:k});k={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:k});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(a){a=server.GetUserInventory({PlayFabId:currentPlayerId});for(var k=0;k<a.Inventory.length;k++)if("CarsProgress"==a.Inventory[k].CatalogVersion){log.debug("found "+a.Inventory[k].ItemId);a.Inventory[k].CustomData.Pr=recalculateCarPr(a.Inventory[k].CustomData,a.Inventory[k].ItemId);var b={};b.Pr=a.Inventory[k].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[k].ItemInstanceId,Data:b})}return a};
function generateFailObj(a){return{Result:"Failed",Message:a}}function generateErrObj(a){return{Result:"Error",Message:a}}function checkBalance(a,k,b,e){if("SC"==a){if(b<k)return generateFailObj("NotEnoughSC")}else if(e<k)return generateFailObj("NotEnoughHC");return"OK"}
function recalculateCarPr(a,k){for(var b=0,e=server.GetCatalogItems({CatalogVersion:"CarCards"}),d=0;d<e.Catalog.length;d++)if(e.Catalog[d].ItemId==k){d=JSON.parse(e.Catalog[d].CustomData);b+=parseInt(d.basePr)+parseInt(d.prPerLvl)*(parseInt(a.CarLvl)-1);break}for(var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),f={Exhaust:a.ExhaustLvl,Engine:a.EngineLvl,Gearbox:a.GearboxLvl,Suspension:a.SuspensionLvl,Tires:a.TiresLvl,Turbo:a.TurboLvl},l,d=0;d<e.Catalog.length;d++)l=JSON.parse(e.Catalog[d].CustomData),
b+=parseInt(l.basePr)+parseInt(l.prPerLvl)*f[e.Catalog[d].ItemId];return b}
function GenerateBlackMarket(a){var k=server.GetCatalogItems({CatalogVersion:"PartCards"}),b={};b.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*k.Catalog.length),d=JSON.parse(k.Catalog[e].CustomData);if(void 0==d)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");b.BMItem0=k.Catalog[e].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;var f=Math.floor(Math.random()*k.Catalog.length);f==e&&(f=k.Catalog.length-e-1);d=JSON.parse(k.Catalog[f].CustomData);
if(void 0==d)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");b.BMItem1=k.Catalog[f].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;for(var k=server.GetCatalogItems({CatalogVersion:"CarCards"}),d=[],f=[],l=0;l<k.Catalog.length;l++){e=JSON.parse(k.Catalog[l].CustomData);if(void 0==e)return generateErrObj("Car card "+k.Catalog[l].ItemId+" has no custom data.");"false"==e.rareCar?d.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):
f.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}0>=d.length?(b.BMItem2=f[Math.floor(Math.random()*f.length)],b.BMItem3=f[Math.floor(Math.random()*f.length)]):0>=f.length?(b.BMItem2=d[Math.floor(Math.random()*d.length)],b.BMItem3=d[Math.floor(Math.random()*d.length)]):(b.BMItem2=d[Math.floor(Math.random()*d.length)],b.BMItem3=f[Math.floor(Math.random()*f.length)]);server.UpdateUserInternalData({PlayFabId:a,Data:b});l=[];l.push("BlackMarketResetMinutes");a=server.GetTitleData({PlayFabId:a,
Keys:l});b.BMTime=60*parseInt(a.Data.BlackMarketResetMinutes);return b}function GetCurrentBlackMarket(a,k){var b={},e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:a,Keys:d});b.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-k.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)b["BMItem"+e]=k.Data["BMItem"+e].Value;return b}
handlers.purchaseBMItem=function(a,k){log.debug("purchasing item "+a.itemId+" from black market");if(0>a.itemId||3<a.itemId)return generateFailObj("invalid item index");var b=[];b.push("BMItem"+a.itemId);var b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:b}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),b=b.Data["BMItem"+a.itemId].Value.split("_");log.debug("userArray: "+b);var d=e.VirtualCurrency[b[1]];5!=b.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var f;f=2>a.itemId?"PartCards":"CarCards";var l=parseInt(b[2])+parseInt(b[3])*parseInt(b[4]),d=checkBalance(b[1],l,d,d);if("OK"!=d)return d;try{for(var h,d=0;d<e.length;d++)if(e[d].ItemId==b[0]&&e[d].CatalogVersion==f){h=e[d].ItemInstanceId;var c;if(void 0==e[d].CustomData.Amount)c={Amount:1};else{var g=Number(e[d].CustomData.Amount)+1;isNaN(g)&&(g=1);c={Amount:g}}server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h,Data:c});break}void 0==h&&(g=[],g.push(b[0]),h=server.GrantItemsToUser({CatalogVersion:f,
PlayFabId:currentPlayerId,ItemIds:g}).ItemGrantResults[0].ItemInstanceId,void 0==h?generateErrObj("grantRequest denied"):(c={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h,Data:c})));var q=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b[1],Amount:l}),p=b[0]+"_"+b[1]+"_"+b[2]+"_"+(parseInt(b[3])+1)+"_"+b[4];log.debug("generatedArray: "+p);h={};h["BMItem"+a.itemId]=p;server.UpdateUserInternalData({PlayFabId:currentPlayerId,
Data:h});var m=[{ItemId:b[0],CatalogVersion:f,CustomData:c}];c={};c[q.VirtualCurrency]=q.Balance;var n=a.itemId+"_"+b[2]+"_"+(parseInt(b[3])+1)+"_"+b[4],d={Inventory:m,VirtualCurrency:c};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:d,BMItemChange:n}}catch(r){generateErrObj("Something went horribly wrong somewhere: "+r)}};
handlers.retrieveBlackMarket=function(a,k){var b=[];b.push("BMTime");for(var e=0;4>e;e++)b.push("BMItem"+e);b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:b});if(void 0==b.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);e=new Date;log.debug("milliseconds passed: "+e.getTime());log.debug("BMTime: "+b.Data.BMTime.Value);var d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(e.getTime()-
parseInt(b.Data.BMTime.Value)>6E4*parseInt(d.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,b)};
handlers.updateCarCust=function(a,k){for(var b=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],d="-1",f={},l={PaintJobs:{itemOwned:"no",itemCustData:a.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:a.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:a.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:a.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:a.wsId,carItemId:"WindshieldId"}},h=0;h<b.Inventory.length;h++)b.Inventory[h].ItemId==
a.carId&&"CarsProgress"==b.Inventory[h].CatalogVersion&&(d=b.Inventory[h].ItemInstanceId),b.Inventory[h].ItemId in l&&(l[b.Inventory[h].ItemId].itemOwned="yes",l[b.Inventory[h].ItemId].itemCustData in b.Inventory[h].CustomData?f[l[b.Inventory[h].ItemId].carItemId]=l[b.Inventory[h].ItemId].itemCustData:log.debug("user doesn't own: "+b.Inventory[h].ItemId+" "+l[b.Inventory[h].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+a.carId);for(var c in l)l.hasOwnProperty(c)&&
"no"==l[c].itemOwned&&e.push(c);if(f=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f});b=[{ItemId:a.carId,CatalogVersion:"CarsProgress",CustomData:f}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),d={0:"Owned"},h=0;h<e.ItemGrantResults.length;h++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[h].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:b}}};
handlers.purchaseItems=function(a,k){log.debug("RETRIEVING USER INVENTORY");var b=server.GetUserInventory({PlayFabId:currentPlayerId}),e=b.VirtualCurrency.SC,d=b.VirtualCurrency.HC;log.debug("user currency: SC: "+e+" HC: "+d);switch(a.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+a.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),l=!1,h,c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.carId&&"CarsProgress"==
b.Inventory[c].CatalogVersion){l=!0;log.debug("car is in user's inventory!");h=b.Inventory[c];break}for(var g,c=0;c<f.Catalog.length;c++)if(f.Catalog[c].ItemId==a.carId){g=JSON.parse(f.Catalog[c].CustomData);log.debug("cardInfo found!");break}if(void 0==g)return log.error("cardInfo undefined!"),g={Result:"Error",Message:"CardNotFoundForCarwithID: "+a.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==l){log.debug("user has car: "+a.carId+
"... upgrading");f=parseInt(g.baseCurrCost)+parseInt(h.CustomData.CarLvl)*parseInt(g.currCostPerLvl);d=checkBalance(g.currType,f,e,d);if("OK"!=d)return d;log.debug("user has enough currency. Let's check for card balance");d=parseInt(g.baseCardCost)+parseInt(h.CustomData.CarLvl)*parseInt(g.cardCostPerLvl);log.debug("cardCost: "+d);for(var q=!1,c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.carId&&"CarCards"==b.Inventory[c].CatalogVersion){log.debug("consuming: "+b.Inventory[c].ItemInstanceId);
q=!0;try{var p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[c].ItemInstanceId,ConsumeCount:d})}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}log.debug("user has enough cards to purchase upgrade!");if(0==q)return generateFailObj("No cards found");b=parseInt(h.CustomData.CarLvl)+1;c=recalculateCarPr(h.CustomData,h.ItemId);log.debug("upgrading to car lvl: "+b+" and pr: "+c);c={CarLvl:b,Pr:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:h.ItemInstanceId,Data:c});var m;0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:g.currType,Amount:f}));log.debug("Upgrade Complete!");c=[{ItemId:a.carId,CatalogVersion:"CarCards",RemainingUses:p.RemainingUses},{ItemId:a.carId,CatalogVersion:"CarsProgress",CustomData:c}];g={};c={Inventory:c};void 0!=m&&(g[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=g);g={Result:"OK",Message:"InventoryUpdate",InventoryChange:c}}else{log.debug("user doesn't have car: "+
a.carId+"... looking for card");q=!1;for(c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.carId&&"CarCards"==b.Inventory[c].CatalogVersion){log.debug("consuming: "+b.Inventory[c].ItemInstanceId);q=!0;try{p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[c].ItemInstanceId,ConsumeCount:g.baseCardCost})}catch(u){return generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");
d=checkBalance(g.currType,g.baseCurrCost,e,d);if("OK"!=d)return d;c=[];c.push(a.carId);d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});if(0==d.ItemGrantResults[0].Result){log.error("Something went wrong while giving user the item, refunding cards");m=[];for(c=0;c<g.baseCardCost;c++)m.push(a.carId);server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:m});return generateFailObj("Something went wrong while giving user the item, refunding cards.")}0<
g.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:g.currType,Amount:g.baseCurrCost}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});c={TiresLvl:"0",TurboLvl:"0",PaintId:g.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,
Data:c});c={PlatesId:"0",WindshieldId:"0",Pr:g.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});h=d=!1;for(var n,c=0;c<b.Inventory.length;c++)if("PaintJobs"==b.Inventory[c].ItemId){h=!0;log.debug("user has paintjobs");void 0!=b.Inventory[c].CustomData?(log.debug("user has paintjobs customData"),g.defaultPaintID in b.Inventory[c].CustomData?(log.debug("user has paintjob already"),d=!0):(log.debug("user doesn't have paintjob"),
n={},n[g.defaultPaintID]="Owned")):(n={},n[g.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[c].ItemInstanceId,Data:n});break}0==h&&(paintToGive=[],paintToGive.push("PaintJobs"),c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[g.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,
Data:n}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:g.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:g.basePr};c=[{ItemId:a.carId,CatalogVersion:"CarCards",RemainingUses:p.RemainingUses},{ItemId:a.carId,CatalogVersion:"CarsProgress",CustomData:c}];0==d&&(b={},b[g.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:b}));g={};c={Inventory:c};void 0!=m&&(g[m.VirtualCurrency]=
m.Balance,c.VirtualCurrency=g);g={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:c}}return g;case "partUpgrade":log.debug("Upgrading Part: "+a.partId+" on Car: "+a.carId);log.debug("Checking to see if car exists in catalog");n=server.GetCatalogItems({CatalogVersion:"CarsProgress"});l=!1;for(c=0;c<n.Catalog.length;c++)if(n.Catalog[c].ItemId==a.carId){l=!0;break}if(0==l)return log.error("invalid car ID"),g={Result:"Error",Message:"car with ID: "+a.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");
n=server.GetCatalogItems({CatalogVersion:"PartCards"});l=!1;for(c=0;c<n.Catalog.length;c++)if(n.Catalog[c].ItemId==a.partId){g=JSON.parse(n.Catalog[c].CustomData);l=!0;break}if(0==l)return log.error("invalid part ID"),g={Result:"Error",Message:"part with ID: "+a.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+a.carId);l=!1;for(c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.carId&&"CarsProgress"==b.Inventory[c].CatalogVersion){l=!0;log.debug("car is in user's inventory!");
h=b.Inventory[c];break}if(0==l)return generateFailObj("car with ID: "+a.carId+" not found in user inventory.");log.debug("Checking to see whether user has enough money to upgrade part");log.debug("Checking to see if user has part and or has enough parts");n=!1;for(c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.partId&&"PartCards"==b.Inventory[c].CatalogVersion){n=!0;log.debug("part is in user's inventory!");var q={},r={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",
Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+a.partId+" cost and modifying "+r[a.partId]);var l=parseInt(g.baseCardCost)+parseInt(h.CustomData[r[a.partId]])*parseInt(g.cardCostPerLvl),f=parseInt(g.baseCurrCost)+parseInt(h.CustomData[r[a.partId]])*parseInt(g.currCostPerLvl),t=parseInt(h.CustomData[r[a.partId]])+1;q[r[a.partId]]=t;h.CustomData[r[a.partId]]=t;log.debug("we need: "+l+" cards");d=checkBalance(g.currType,f,e,d);if("OK"!=d)return d;log.debug("consuming part instance: "+b.Inventory[c].ItemInstanceId);
try{p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[c].ItemInstanceId,ConsumeCount:l})}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==n)return generateFailObj("Part not found");0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:g.currType,Amount:f}));c=recalculateCarPr(h.CustomData,h.ItemId);q.Pr=c;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemInstanceId,
Data:q});c=[{ItemId:a.partId,CatalogVersion:"PartCards",RemainingUses:p.RemainingUses},{ItemId:a.carId,CatalogVersion:"CarsProgress",CustomData:q}];log.debug("succesfully upgraded part!");g={};c={Inventory:c};void 0!=m&&(g[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=g);return g={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:c};case "custPurchase":log.debug("Purchasing Customization: "+a.custId+" with val: "+a.custVal);log.debug("Checking to see if customization exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"Customization"});g=0;m="SC";for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==a.custId){r=p.Catalog[c];g=JSON.parse(p.Catalog[c].CustomData);c=a.custVal+",Cost";m=g[a.custVal+",Curr"];g=g[c];d=checkBalance(m,g,e,d);if("OK"!=d)return d;log.debug("custCurr: "+m);log.debug("custPrice: "+g);break}if(void 0==r)return log.error("Customization does not exist in catalog"),g={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");
for(c=0;c<b.Inventory.length;c++)if(b.Inventory[c].ItemId==a.custId){log.debug("user has customization category!");t=b.Inventory[c];l=b.Inventory[c].ItemInstanceId;if(void 0!=t.CustomData&&String(a.custVal)in t.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==t){log.info("user doesn't have customization category. Granting ... ");c=[];c.push(a.custId);c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c});if(0==c.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),
g={Result:"Error",Message:"something went wrong while granting user customization class object."};l=c.ItemGrantResults[0].ItemInstanceId}c={};c[String(a.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l,Data:c});c=[{ItemId:a.custId,CatalogVersion:"Customization",CustomData:c}];0<g?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:g}),g={},g[m.VirtualCurrency]=m.Balance,c={Inventory:c,VirtualCurrency:g}):c=
{Inventory:c};return g={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:c};case "softCurrencyPurchase":log.debug("Purchasing pack: "+a.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});b=!1;for(c=p=0;c<m.Catalog.length;c++)if(m.Catalog[c].ItemId==a.packId){p=m.Catalog[c].VirtualCurrencyPrices.HC;g=JSON.parse(m.Catalog[c].CustomData);b=!0;break}if(0==b)return g={Result:"Error",Message:"pack with ID: "+
a.packId+" not found in catalog."};if(0>=p)return g={Result:"Error",Message:"pack with ID: "+a.packId+" shouldn't have negative cost."};if(p>d)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:p});c=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:g.quantity});g={};g[c.VirtualCurrency]=c.Balance;g[m.VirtualCurrency]=m.Balance;return g={Result:"OK",Message:"SoftCurrencyPurchased",
InventoryChange:{VirtualCurrency:g}};default:log.debug("invalid purchase parameter")}};handlers.giveMoney=function(a){a=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a.curr,Amount:a.amount});var k={};k[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:k}}};
handlers.grantItems=function(a){for(var k=[],b=0;b<a.amount;b++)k.push(a.itemId);try{var e=server.GrantItemsToUser({CatalogVersion:a.catalogId,PlayFabId:currentPlayerId,ItemIds:k});return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:a.itemId,CatalogVersion:a.catalogId,RemainingUses:e.ItemGrantResults[0].RemainingUses}]}}}catch(d){generateErrObj("Error: "+d)}};
handlers.openChest=function(a,k){log.debug(a.currencyReq);for(var b in a.currencyReq)log.debug(a.currencyReq[b]),0<a.currencyReq[b]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b,Amount:a.currencyReq[b]});var e=0;if(0<a.carCardsRequestSize){var d=Array(a.carCardsRequestSize);log.debug(a.carCardsRequest);for(b in a.carCardsRequest)if(a.carCardsRequest.hasOwnProperty(b))for(var f=0;f<a.carCardsRequest[b];f++)d[e]=b,e++;server.GrantItemsToUser({CatalogVersion:"CarCards",
PlayFabId:currentPlayerId,ItemIds:d})}if(0<a.partCardsRequestSize){e=0;d=Array(a.partCardsRequestSize);log.debug(a.partCardsRequest);for(b in a.partCardsRequest)if(a.partCardsRequest.hasOwnProperty(b))for(f=0;f<a.partCardsRequest[b];f++)d[e]=b,e++;0<d.length&&server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:d})}};
handlers.buyChest=function(a,k){var b=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a.curr,a.cost,b.VirtualCurrency.SC,b.VirtualCurrency.HC))return generateFailObj("not enough money");var b=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a.curr,Amount:a.cost}),e={};e[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:e}}};handlers.getServerTime=function(a,k){return{time:new Date}};

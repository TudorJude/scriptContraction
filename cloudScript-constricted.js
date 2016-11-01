function checkCarDataValidity(c,g){if(void 0==c.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});for(var e=0,d=0;d<g.Catalog.length;d++)if(g.Catalog[d].ItemId==c.ItemId){var f=
JSON.parse(g.Catalog[d].CustomData),e=parseInt(f.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a})}catch(h){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:e}}return"OK"}function generateFailObj(c){return{Result:"Failed",Message:c}}
function generateErrObj(c){return{Result:"Error",Message:c}}function generateInventoryChange(c,g){return{Result:"OK",Message:c,InventoryChange:g}}function checkBalance(c,g,a,e){if("SC"==c){if(a<g)return generateFailObj("NotEnoughSC")}else if(e<g)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(c){var g=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==g.Data.LeagueSubdivisions||void 0==g.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(g.Data.LeagueSubdivisions).leagues,g=JSON.parse(g.Data.SubdivisionTrophyRanges).subdivisions,e=0;e<a.length;e++)if(!(Number(c)>Number(g[a[e]])))return e}
function recalculateCarPr(c,g,a,e){var d=0,f;f=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<f.Catalog.length;a++)if(f.Catalog[a].ItemId==g){a=JSON.parse(f.Catalog[a].CustomData);d+=parseInt(a.basePr)+getObjectValueFromLevel(a,"prPerLvl",c.CarLvl-1);break}e=void 0==e?server.GetCatalogItems({CatalogVersion:"PartCards"}):e;c={Exhaust:c.ExhaustLvl,Engine:c.EngineLvl,Gearbox:c.GearboxLvl,Suspension:c.SuspensionLvl,Tires:c.TiresLvl,Turbo:c.TurboLvl};for(a=0;a<e.Catalog.length;a++)g=
JSON.parse(e.Catalog[a].CustomData),log.debug(e.Catalog[a].ItemId+" "+Number(c[e.Catalog[a].ItemId])),d+=parseInt(g.basePr)+getObjectValueFromLevel(g,"prPerLvl",Number(c[e.Catalog[a].ItemId]));return d}
function GenerateBlackMarket(c){var g=1,a=server.GetPlayerStatistics({PlayFabId:c,StatisticNames:["League"]});0!=a.Statistics.length&&(g=a.Statistics[0].Value.toString());var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var d=Math.floor(Math.random()*e.Catalog.length),f=JSON.parse(e.Catalog[d].CustomData);if(void 0==f)return generateErrObj("Part card "+e.Catalog[b].ItemId+" has no custom data.");a.BMItem0=e.Catalog[d].ItemId+"_"+f.BMCurrType+"_"+f.BMbasePrice+
"_0_"+f.BMpriceIncrPerBuy;var h=Math.floor(Math.random()*e.Catalog.length);h==d&&(h=e.Catalog.length-d-1);f=JSON.parse(e.Catalog[h].CustomData);if(void 0==f)return generateErrObj("Part card "+e.Catalog[b].ItemId+" has no custom data.");a.BMItem1=e.Catalog[h].ItemId+"_"+f.BMCurrType+"_"+f.BMbasePrice+"_0_"+f.BMpriceIncrPerBuy;for(var e=server.GetCatalogItems({CatalogVersion:"CarCards"}),f=[],h=[],b=0;b<e.Catalog.length;b++){d=JSON.parse(e.Catalog[b].CustomData);if(void 0==d)return generateErrObj("Car card "+
e.Catalog[b].ItemId+" has no custom data.");d.unlockedAtRank>g+1||("false"==d.rareCar?f.push(e.Catalog[b].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy):h.push(e.Catalog[b].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy))}0>=f.length?(a.BMItem2=h[Math.floor(Math.random()*h.length)],a.BMItem3=h[Math.floor(Math.random()*h.length)]):0>=h.length?(a.BMItem2=f[Math.floor(Math.random()*f.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]):(a.BMItem2=f[Math.floor(Math.random()*
f.length)],a.BMItem3=h[Math.floor(Math.random()*h.length)]);server.UpdateUserInternalData({PlayFabId:c,Data:a});g=[];g.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:c,Keys:g});a.BMTime=60*parseInt(c.Data.BlackMarketResetMinutes);return a}
function GetCurrentBlackMarket(c,g){var a={},e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:c,Keys:d});a.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-g.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=g.Data["BMItem"+e].Value;return a}function GetValueFromStatistics(c,g,a){for(var e,d=0;d<c.length;d++)c[d].StatisticName===g&&(e=c[d]);return void 0===e?void 0!==a?a:0:Number(e.Value)}
function getCatalogItem(c,g){for(var a=server.GetCatalogItems({CatalogVersion:c}),e=0;e<a.Catalog.length;e++)if(a.Catalog[e].ItemId===g)return a.Catalog[e]}function getObjectValueFromLevel(c,g,a,e){e||(e=0);if(!c[g]||!c[g].length)return e;var d=Number(c[g].length);a>=d&&(a=d-1);return Number(c[g][a])||e}
handlers.buyChest=function(c,g){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(c.curr,c.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<c.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.cost}),e={};e[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",{VirtualCurrency:e})}return generateInventoryChange("ChestBought",{})};
handlers.endGame=function(c,g){var a="01",e,d="0";"rWin"==c.outcome&&(d="1");var f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=f.Statistics.length&&(e=f.Statistics[0].Value.toString(),a=Number(e).toString(2));var f=0,h;h=Array(a.length);for(var b=0;b<h.length-1;b++)h[b]=a[b];h[h.length-1]=d;a=h;d=a.length;for(b=0;b<a.length;b++)"1"==a[b]&&f++;h=Math.round(f/d*100);var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),d=0,l,f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});0!=f.Statistics.length&&(d=f.Statistics[0].Value,log.debug("getting trophy count "+f.Statistics[0].Value));l=d=Number(d);f=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});log.debug("pDat.Data[trophyLose] "+f.Data.trophyLose.Value);log.debug("pDat.Data[trophyWin] "+f.Data.trophyWin.Value);f=void 0==f.Data.trophyLose||void 0==f.Data.trophyWin?45:Number(f.Data.trophyLose.Value)+Number(f.Data.trophyWin.Value);"rWin"==c.outcome&&
(d+=f);log.debug("trophies change: "+l+" => "+d);f=calculateLeague(d);for(b=e=0;b<a.length;b++)"1"==a[b]&&(e+=Math.pow(2,b));b=[];b.push({StatisticName:"WinLoss",Version:"0",Value:e});a={StatisticName:"TrophyCount",Version:"0",Value:d};b.push(a);a={StatisticName:"League",Version:"0",Value:f};b.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});if("rOot"==c.outcome){var p={TrophyCount:d,League:f};return{Result:p}}a=JSON.parse(k.Data.SubdivisionTrophyRanges);for(b=0;b<a.subdivisions.length;b++)if(l<
a.subdivisions[b]){p=b;break}b=[];b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecPos",Value:c.recordingPos});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecRot",Value:c.recordingRot});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecHeader",Value:c.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:b});b=server.GetTitleInternalData({Key:"RecSubDivision"+p}).Data["RecSubDivision"+p];if(void 0==b)a=[],h={wl:h,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId},a.push(h);else{a=
JSON.parse(b);h={wl:h,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId};k=!1;for(b=l=0;b<a.length;b++)a[b].uId==currentPlayerId&&l++;if(2<l)return p={TrophyCount:d,League:f},{Result:p};for(b=0;b<a.length;b++)if(a[b].e==c.envIndex&&a[b].c==c.courseIndex){k=!0;a[b]=h;if(1==a.length)break;if(0<b)if(a[b].wl>a[b-1].wl){if(b==a.length-1)break;for(l=b+1;l<a.length;l++)if(a[l-1].wl>a[l].wl)e=a[l],a[l]=a[l-1],a[l-1]=e;else break}else for(l=b-1;0<=l;l--)if(a[l+1].wl<a[l].wl)e=a[l],a[l]=a[l+1],a[l+1]=e;else break;
else for(l=b+1;l<a.length;l++)if(a[l-1].wl>a[l].wl)e=a[l],a[l]=a[l-1],a[l-1]=e;else break}0==k&&a.push(h)}b=JSON.stringify(a);server.SetTitleInternalData({Key:"RecSubDivision"+p,Value:b});p={TrophyCount:d,League:f};return{Result:p}};
function UpdateExperience(c,g,a,e,d,f){c=JSON.parse(getCatalogItem(c,g).CustomData)[a];if(isNaN(Number(c)))g=Number(c.length),e>=g&&(e=g-1),e=Number(c[e]);else if(e=Number(c),0===e)return 0;f=f||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;f=GetValueFromStatistics(f,"Experience",0)+e;if(!d)return f;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:[{StatisticName:"Experience",Version:"0",Value:f}]});return f}
handlers.getServerTime=function(c,g){return{time:new Date}};handlers.giveMoney=function(c){c=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.amount});var g={};g[c.VirtualCurrency]=c.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:g}}};
handlers.grantItems=function(c){for(var g=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,d=0;d<g.Inventory.length;d++)if(g.Inventory[d].ItemId==c.itemId&&g.Inventory[d].CatalogVersion==c.catalogId){a=void 0==g.Inventory[d].CustomData?c.amount:void 0==g.Inventory[d].CustomData.Amount?c.amount:isNaN(Number(g.Inventory[d].CustomData.Amount))?c.amount:Number(g.Inventory[d].CustomData.Amount)+c.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[d].ItemInstanceId,
Data:a});e=!0;break}0==e&&(g=[],g.push(c.itemId),g=server.GrantItemsToUser({CatalogVersion:c.catalogId,PlayFabId:currentPlayerId,ItemIds:g}),a={Amount:c.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:c.itemId,CatalogVersion:c.catalogId,CustomData:a}]}}};
handlers.initServerData=function(c){c=[];var g={StatisticName:"TrophyCount",Version:"0",Value:"0"};c.push(g);g={StatisticName:"League",Version:"0",Value:"0"};c.push(g);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var g={0:"Owned"},a=0;a<c.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[a].ItemInstanceId,Data:g});c=[];c.push("FordFocus");c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});g={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g=[];g.push("Engine");g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:g});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});g={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g})};
handlers.openChest=function(c,g){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<c.currCost){if("OK"!=checkBalance(c.currType,c.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.currType,Amount:c.currCost})}for(var e in c.currencyReq)0<c.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e,Amount:c.currencyReq[e]});var d;
for(e in c.carCardsRequest)if(c.carCardsRequest.hasOwnProperty(e)){d=!1;for(var f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"CarCards"==a.Inventory[f].CatalogVersion){d=void 0==a.Inventory[f].CustomData?Number(c.carCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(c.carCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(c.carCardsRequest[e]):Number(a.Inventory[f].CustomData.Amount)+Number(c.carCardsRequest[e]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:d});d=!0;break}0==d&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:f}),d={Amount:c.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:d}))}for(e in c.partCardsRequest)if(c.partCardsRequest.hasOwnProperty(e)){d=!1;for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"PartCards"==a.Inventory[f].CatalogVersion){d=
void 0==a.Inventory[f].CustomData?Number(c.partCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(c.partCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(c.partCardsRequest[e]):Number(a.Inventory[f].CustomData.Amount)+Number(c.partCardsRequest[e]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:d});d=!0;break}0==d&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,
ItemIds:f}),d={Amount:c.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:d}))}a=server.GetUserInventory({PlayFabId:currentPlayerId});c.chestId&&(e=UpdateExperience("Chests",c.chestId,"xpGain",0,!0),0<e&&(a.Experience=e));return generateInventoryChange("InventoryUpdated",a)};
handlers.purchaseBMItem=function(c,g){if(0>c.itemId||3<c.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+c.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+c.itemId].Value.split("_"),d=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");var f;f=2>c.itemId?"PartCards":"CarCards";var h=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),
d=checkBalance(a[1],h,d,d);if("OK"!=d)return d;for(var b,k,d=0;d<e.Inventory.length;d++)if(e.Inventory[d].ItemId==a[0]&&e.Inventory[d].CatalogVersion==f){b=e.Inventory[d].ItemInstanceId;void 0===e.Inventory[d].CustomData?k={Amount:1}:void 0===e.Inventory[d].CustomData.Amount?k={Amount:1}:(k=Number(e.Inventory[d].CustomData.Amount)+1,isNaN(k)&&(k=1),k={Amount:k});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k});break}void 0===b&&(b=[],b.push(a[0]),b=server.GrantItemsToUser({CatalogVersion:f,
PlayFabId:currentPlayerId,ItemIds:b}).ItemGrantResults[0].ItemInstanceId,void 0===b?generateErrObj("grantRequest denied"):(k={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k})));b=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:h});h=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={};e["BMItem"+c.itemId]=h;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});k=[{ItemId:a[0],CatalogVersion:f,
CustomData:k}];f={};f[b.VirtualCurrency]=b.Balance;a=c.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];d={Inventory:k,VirtualCurrency:f};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:d,BMItemChange:a}};
handlers.purchaseItems=function(c,g){var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,d=a.VirtualCurrency.HC;switch(c.purchaseType){case "carUpgrade":return upgradeCar(c,a,e,d);case "partUpgrade":return upgradePart(c,a,e,d);case "custPurchase":for(var f=server.GetCatalogItems({CatalogVersion:"Customization"}),h,b=0,k="SC",l=0;l<f.Catalog.length;l++)if(f.Catalog[l].ItemId==c.custId){h=f.Catalog[l];cardInfo=JSON.parse(f.Catalog[l].CustomData);b=c.custVal+",Cost";k=cardInfo[c.custVal+
",Curr"];b=cardInfo[b];d=checkBalance(k,b,e,d);if("OK"!=d)return d;break}if(void 0==h)return generateErrObj("Customization does not exist in catalog.");for(var p,n,l=0;l<a.Inventory.length;l++)if(a.Inventory[l].ItemId==c.custId){p=a.Inventory[l];n=a.Inventory[l].ItemInstanceId;if(void 0!=p.CustomData&&String(c.custVal)in p.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==p){log.info("user doesn't have customization category. Granting ... ");d=[];d.push(c.custId);
d=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:d});if(0==d.ItemGrantResults[0].Result)return generateErrObj("something went wrong while granting user customization class object.");n=d.ItemGrantResults[0].ItemInstanceId}d={};d[String(c.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:n,Data:d});d=[{ItemId:c.custId,CatalogVersion:"Customization",CustomData:d}];0<b?(k=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k,Amount:b}),b={},b[k.VirtualCurrency]=k.Balance,l={Inventory:d,VirtualCurrency:b}):l={Inventory:d};return generateInventoryChange("InventoryUpdateNewCustomization",l);case "softCurrencyPurchase":k=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});b=!1;for(l=n=0;l<k.Catalog.length;l++)if(k.Catalog[l].ItemId==c.packId){n=k.Catalog[l].VirtualCurrencyPrices.HC;cardInfo=JSON.parse(k.Catalog[l].CustomData);b=!0;break}if(0==b)return generateErrObj("pack with ID: "+c.packId+" not found in catalog.");
if(0>=n)return generateErrObj("pack with ID: "+c.packId+" shouldn't have negative cost.");if(n>d)return generateFailObj("Not enough HC.");k=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:n});d=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:cardInfo.quantity});b={};b[d.VirtualCurrency]=d.Balance;b[k.VirtualCurrency]=k.Balance;return generateInventoryChange("SoftCurrencyPurchased",{VirtualCurrency:b});default:log.debug("invalid purchase parameter")}};
handlers.requestCurrency=function(c){return{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(c){c=server.GetUserInventory({PlayFabId:currentPlayerId});for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),e=!1,d=0;d<c.Inventory.length;d++)if("CarsProgress"==c.Inventory[d].CatalogVersion){var e=!0,f=checkCarDataValidity(c.Inventory[d],g);if("PlayFabError"==f||void 0===f)return generateErrObj("PlayfabError");"OK"==f?log.debug("Data for "+c.Inventory[d].ItemId+" OK"):c.Inventory[d].CustomData=f;
c.Inventory[d].CustomData.Pr=recalculateCarPr(c.Inventory[d].CustomData,c.Inventory[d].ItemId,g,a);f={};f.Pr=c.Inventory[d].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[d].ItemInstanceId,Data:f})}return!1===e?(c=[],c.push("FordFocus"),c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c}),g={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g}),g={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g}),g={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g}),generateErrObj("UserHasNoCars ... reiniting")):c};
handlers.retrieveBlackMarket=function(c,g){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0===a.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(!0===c.reset){a="HC";e=200;d=server.GetTitleData({Keys:["BlackMarketResetCost"]});void 0!==d.Data.BlackMarketResetCost&&(e=d.Data.BlackMarketResetCost.split("_"),
a=e[0],e=Number(e[1]));if(0<e){d=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,e,d.VirtualCurrency.SC,d.VirtualCurrency.HC))return generateFailObj("not enough money");e=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:e});a=GenerateBlackMarket(currentPlayerId);d={};d[e.VirtualCurrency]=e.Balance;e={VirtualCurrency:d};a.InventoryChange=e;return a}return GenerateBlackMarket(currentPlayerId)}return e.getTime()-parseInt(a.Data.BMTime.Value)>
6E4*parseInt(d.Data.BlackMarketResetMinutes)?GenerateBlackMarket(currentPlayerId):GetCurrentBlackMarket(currentPlayerId,a)};
handlers.startGame=function(c,g){var a="10",e,d=50,f,h=0;f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=f.Statistics.length){e=f.Statistics[0].Value.toString();a=Number(e).toString(2);f=a.length;for(var b=0;b<a.length;b++)"1"==a[b]&&h++;d=Math.round(h/f*100)}a+="0";20<a.length&&(a=a.slice(1));var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges","TrophyGainRange","TrophyLoseRange"]});f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});h=0;0!=f.Statistics.length&&(h=f.Statistics[0].Value);var h=Number(h),l=JSON.parse(k.Data.SubdivisionTrophyRanges),p=JSON.parse(k.Data.LeagueSubdivisions),n=43,m=43,u;f=k.Data.TrophyGainRange.split("_");u=k.Data.TrophyLoseRange.split("_");e=Number(f[0]);f=Number(f[1]);for(var k=Number(u[0]),z=Number(u[1]),b=0;b<l.subdivisions.length;b++)if(h<Number(l.subdivisions[b])){n=b;b<l.subdivisions.length-1&&(m=b+1);break}u=Number(l.subdivisions[m])-Number(l.subdivisions[n]);
log.debug("nextSubDivision "+m+" subDivision "+n);log.debug(" sdvalParsed.subdivisions[nextSubDivision] "+l.subdivisions[m]+" sdvalParsed.subdivisions[subDivision] "+l.subdivisions[n]);0>=u&&(u=400);log.debug("subDivisionRange "+u);var r=server.GetTitleInternalData({Keys:"RecSubDivision"+n}).Data["RecSubDivision"+n],m=!1;void 0==r&&(m=!0);var v,q=n="noop",w,b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["lastOpp"]});if(void 0==b.Data||void 0==b.Data.lastOpp)q=n="noop";else for(w=b.Data.lastOpp.Value.split(","),
b=0;b<w.length;b++)0==b&&(n=w[b]),1==b&&(q=w[b]);v=0==m?JSON.parse(r):[];var C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>v.length&&(m=!0);var D=Array(v.length),B=0,r=Array(v.length);w=0;for(var A=Array(v.length),x=0,b=0;b<v.length;b++)1==m&&(C[5*Number(v[b].e)+Number(v[b].c)]=1),v[b].uId!=currentPlayerId&&(D[B]=v[b],B++,v[b].uId!=n&&(r[w]=v[b],w++,v[b].uId!=q&&(A[x]=v[b],x++)));if(1==m){for(b=q=m=0;b<C.length;b++)if(0==C[b]){m=Math.floor(b/5);q=b%5;break}b=server.GetTitleData({Keys:"MasterUser"});if(void 0!=
b.Data.MasterUser&&(b=server.GetUserReadOnlyData({PlayFabId:b.Data.MasterUser,Keys:[m+"_"+q+"_RecPos",m+"_"+q+"_RecRot",m+"_"+q+"_RecHeader"]}),void 0!=b.Data&&void 0!=b.Data[m+"_"+q+"_RecPos"]&&void 0!=b.Data[m+"_"+q+"_RecRot"]&&void 0!=b.Data[m+"_"+q+"_RecHeader"])){n=!0;0==h?(h=f,n=!1):h-=k;1>=h&&(h=1);e=parseInt(a,2);var a=[],y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",Value:t};a.push(h);
server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:f,trophyLose:k};0==n&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"Default",PosData:b.Data[m+"_"+q+"_RecPos"].Value,RotData:b.Data[m+"_"+q+"_RecRot"].Value,HeaderData:b.Data[m+"_"+q+"_RecHeader"].Value,TrophyLose:k,TrophyWin:f,Opp:"Mniezo"}}}if(0==B)return generateErrObj("no valid recording found for this subdivision");t=D;m=B;0<w&&(m=
w,t=r);0<x&&(m=x,t=A);r=m-1;for(b=0;b<m;b++)if(t[b].wl>d){r=b;break}d=Math.min(m,3);q=Array(d);for(b=0;b<d;b++)q[b]=0>=r?t[b]:r>=m-1?t[m-1-b]:t[r-Math.floor(d/2)+b];t=Math.floor(Math.random()*d);b=q[t].uId;d=q[t].e;m=q[t].c;q=server.GetUserReadOnlyData({PlayFabId:b,Keys:[d+"_"+m+"_RecPos",d+"_"+m+"_RecRot",d+"_"+m+"_RecHeader"]});if(void 0==q)return generateErrObj("Did not find recording for this user: "+b);var r=server.GetPlayerCombinedInfo({PlayFabId:b,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=h,t=Number(calculateLeague(h));w="UserGenerated";x=0<t?Number(l.subdivisions[p.leagues[t-1]]):0;p=t>=p.leagues.length-1?2*x:Number(l.subdivisions[p.leagues[t]]);l=JSON.parse(q.Data[d+"_"+m+"_RecHeader"].Value);void 0!=l&&(y=l.Trophies);y=Number(y);0>=p-x?l=f:Number(Math.abs(A-y))>Number(u)?(l=Math.floor((k+z)/2),k=Math.floor((f+
e)/2),w="Default"):(l=k+Math.floor((z-k)/2*((A-y)/(p-x)+1)),k=e+Math.floor((f-e)/2*((y-A)/(p-x)+1)));p=!0;0==h?(p=!1,h=f):(h-=Number(l),1>=h&&(h=1));e=parseInt(a,2);a=[];y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",Value:t};a.push(h);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:k,trophyLose:l,lastOpp:b+","+n};0==p&&(a.trophyWin=0,a.trophyLose=0);
server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:w,PosData:q.Data[d+"_"+m+"_RecPos"].Value,RotData:q.Data[d+"_"+m+"_RecRot"].Value,HeaderData:q.Data[d+"_"+m+"_RecHeader"].Value,TrophyLose:l,TrophyWin:k,Opp:r.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(c,g){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],d="-1",f={},h={PaintJobs:{itemOwned:"no",itemCustData:c.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:c.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:c.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:c.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:c.wsId,carItemId:"WindshieldId"}},b=0;b<a.Inventory.length;b++)a.Inventory[b].ItemId==
c.carId&&"CarsProgress"==a.Inventory[b].CatalogVersion&&(d=a.Inventory[b].ItemInstanceId),a.Inventory[b].ItemId in h&&(h[a.Inventory[b].ItemId].itemOwned="yes",h[a.Inventory[b].ItemId].itemCustData in a.Inventory[b].CustomData?f[h[a.Inventory[b].ItemId].carItemId]=h[a.Inventory[b].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[b].ItemId+" "+h[a.Inventory[b].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+c.carId);for(var k in h)h.hasOwnProperty(k)&&
"no"==h[k].itemOwned&&e.push(k);if(f=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f});a=[{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:f}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),d={0:"Owned"},b=0;b<e.ItemGrantResults.length;b++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[b].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.updateTrophyCount=function(c,g){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!==e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==c.val&&(a-=30);0>a&&(a=0);"rWin"==c.val&&(a+=60);if("rLose"==c.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==c.val)return{val:a}};
function upgradeCar(c,g,a,e){for(var d=server.GetCatalogItems({CatalogVersion:"CarCards"}),f=!1,h,b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarsProgress"==g.Inventory[b].CatalogVersion){f=!0;h=g.Inventory[b];break}for(var k,b=0;b<d.Catalog.length;b++)if(d.Catalog[b].ItemId==c.carId){k=JSON.parse(d.Catalog[b].CustomData);break}if(void 0===k)return generateErrObj("CardNotFoundForCarwithID: "+c.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data.");
if(!0===f){var l=parseInt(h.CustomData.CarLvl)+1,p=parseInt(k.baseCurrCost)+parseInt(h.CustomData.CarLvl)*parseInt(k.currCostPerLvl),b=checkBalance(k.currType,p,a,e);if("OK"!=b)return b;a=parseInt(k.baseCardCost)+parseInt(h.CustomData.CarLvl)*parseInt(k.cardCostPerLvl);h.CustomData.CarLvl=l;for(var f=!1,n,b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarCards"==g.Inventory[b].CatalogVersion){f=!0;try{if(void 0===g.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");
if(void 0===g.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(g.Inventory[b].CustomData.Amount)>=a)g.Inventory[b].CustomData.Amount-=a,n={Amount:g.Inventory[b].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[b].ItemInstanceId,Data:n});else return generateFailObj("Insufficient cards for real: "+g.Inventory[b].CustomData.Amount+" vs "+a)}catch(u){return generateFailObj("Insufficient cards")}break}if(!1===
f)return generateFailObj("No cards found");g=recalculateCarPr(h.CustomData,h.ItemId,d,void 0);b={CarLvl:l,Pr:g};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemInstanceId,Data:b});var m;0<p&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:p}));c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];n={};b={Inventory:c};void 0!=m&&(n[m.VirtualCurrency]=
m.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,l,!0);return generateInventoryChange("InventoryUpdate",b)}f=!1;for(b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarCards"==g.Inventory[b].CatalogVersion){f=!0;try{if(void 0==g.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==g.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(g.Inventory[b].CustomData.Amount)>=
Number(k.baseCardCost))p=g.Inventory[b].ItemInstanceId,g.Inventory[b].CustomData.Amount-=k.baseCardCost,n={Amount:g.Inventory[b].CustomData.Amount};else return generateFailObj("Insufficient cards: "+g.Inventory[b].CustomData.Amount+" vs "+k.baseCardCost+".")}catch(u){return generateFailObj("Insufficient cards: "+u)}break}if(0==f)return generateFailObj("No cards found");b=checkBalance(k.currType,k.baseCurrCost,a,e);if("OK"!=b)return b;h=[];h.push(c.carId);h=server.GrantItemsToUser({CatalogVersion:"CarsProgress",
PlayFabId:currentPlayerId,ItemIds:h});if(0==h.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:p,Data:n});0<k.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:k.baseCurrCost}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",
GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={PlatesId:"0",WindshieldId:"0",Pr:k.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,
Data:b});d=h=!1;for(b=0;b<g.Inventory.length;b++)if("PaintJobs"==g.Inventory[b].ItemId){d=!0;void 0!=g.Inventory[b].CustomData?k.defaultPaintID in g.Inventory[b].CustomData?h=!0:(l={},l[k.defaultPaintID]="Owned"):(l={},l[k.defaultPaintID]="Owned");void 0!=l&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[b].ItemInstanceId,Data:l});break}0==d&&(paintToGive=[],paintToGive.push("PaintJobs"),g=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,
ItemIds:paintToGive}),l={},l[k.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:l}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:k.basePr};c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];0==
h&&(n={},n[k.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:n}));n={};b={Inventory:c};void 0!=m&&(n[m.VirtualCurrency]=m.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,1,!0);return generateInventoryChange("InventoryUpdateNewCar",b)}
function upgradePart(c,g,a,e){for(var d=server.GetCatalogItems({CatalogVersion:"CarsProgress"}),f=!1,h=0;h<d.Catalog.length;h++)if(d.Catalog[h].ItemId==c.carId){f=!0;break}if(!1===f)return generateErrObj("car with ID: "+c.carId+" not found in catalog.");for(var d=server.GetCatalogItems({CatalogVersion:"PartCards"}),f=!1,b,h=0;h<d.Catalog.length;h++)if(d.Catalog[h].ItemId==c.partId){b=JSON.parse(d.Catalog[h].CustomData);f=!0;break}if(0==f)return generateErrObj("part with ID: "+c.partId+" not found in catalog.");
for(var f=!1,k,h=0;h<g.Inventory.length;h++)if(g.Inventory[h].ItemId==c.carId&&"CarsProgress"==g.Inventory[h].CatalogVersion){f=!0;k=g.Inventory[h];break}if(0==f)return generateFailObj("car with ID: "+c.carId+" not found in user inventory.");for(var l=!1,h=f=0;h<g.Inventory.length;h++)if(g.Inventory[h].ItemId==c.partId&&"PartCards"==g.Inventory[h].CatalogVersion){var l=!0,p={},n={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"},
f=parseInt(k.CustomData[n[c.partId]])+1,m=getObjectValueFromLevel(b,"cardCostPerLvl",f),u=getObjectValueFromLevel(b,"currCostPerLvl",f);p[n[c.partId]]=f;k.CustomData[n[c.partId]]=f;var z;a=checkBalance(b.currType,u,a,e);if("OK"!=a)return a;try{if(void 0!=g.Inventory[h].CustomData&&void 0!=g.Inventory[h].CustomData.Amount&&g.Inventory[h].CustomData.Amount>=m)g.Inventory[h].CustomData.Amount-=m,z={Amount:g.Inventory[h].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:g.Inventory[h].ItemInstanceId,Data:z});else return generateFailObj("Insufficient cards")}catch(v){return generateFailObj("Insufficient cards")}break}if(0==l)return generateFailObj("Part not found");var r;0<u&&(r=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:u}));h=recalculateCarPr(k.CustomData,k.ItemId,void 0,d);p.Pr=h;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemInstanceId,Data:p});k={};h=
{Inventory:[{ItemId:c.partId,CatalogVersion:"PartCards",CustomData:z},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:p}]};void 0!==r&&(k[r.VirtualCurrency]=r.Balance,h.VirtualCurrency=k);h.Experience=UpdateExperience("Balancing","BalancingItem","Parts_"+b.rarity,f,!0);return generateInventoryChange("InventoryUpdatePart",h)};

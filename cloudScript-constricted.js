function checkCarDataValidity(c,g){if(void 0==c.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});for(var d=0,f=0;f<g.Catalog.length;f++)if(g.Catalog[f].ItemId==c.ItemId){var e=
JSON.parse(g.Catalog[f].CustomData),d=parseInt(e.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a})}catch(h){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:d}}return"OK"}function generateFailObj(c){return{Result:"Failed",Message:c}}
function generateErrObj(c){return{Result:"Error",Message:c}}function CheckMaintenance(){var c=server.GetTitleData({Key:["Maintenance"]});return c.Data.Maintenance?c.Data.Maintenance:"true"}function generateMaintenanceObj(){return{Result:"Maintenance",Message:"Servers are temporarily offline"}}function generateInventoryChange(c,g){return{Result:"OK",Message:c,InventoryChange:g}}
function checkBalance(c,g,a,d){if("SC"==c){if(a<g)return generateFailObj("NotEnoughSC")}else if(d<g)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(c){var g=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==g.Data.LeagueSubdivisions||void 0==g.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(g.Data.LeagueSubdivisions).leagues,g=JSON.parse(g.Data.SubdivisionTrophyRanges).subdivisions,d=0;d<a.length;d++)if(!(Number(c)>Number(g[a[d]])))return d}
function recalculateCarPr(c,g,a,d){var f=0,e;e=void 0===a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<e.Catalog.length;a++)if(e.Catalog[a].ItemId==g){f=JSON.parse(e.Catalog[a].CustomData);f=parseInt(f.basePr)+getObjectValueFromLevel(f,"prPerLvl",c.CarLvl);break}d=void 0===d?server.GetCatalogItems({CatalogVersion:"PartCards"}):d;c={Exhaust:c.ExhaustLvl,Engine:c.EngineLvl,Gearbox:c.GearboxLvl,Suspension:c.SuspensionLvl,Tires:c.TiresLvl,Turbo:c.TurboLvl};for(a=0;a<d.Catalog.length;a++)g=
JSON.parse(d.Catalog[a].CustomData),f+=getObjectValueFromLevel(g,"prPerLvl",Number(c[d.Catalog[a].ItemId]));return f}
function GenerateBlackMarket(c){var g=1,a=server.GetPlayerStatistics({PlayFabId:c,StatisticNames:["League"]});0!=a.Statistics.length&&(g=a.Statistics[0].Value.toString());0>=Number(g)&&(g=1);for(var d=server.GetCatalogItems({CatalogVersion:"PartCards"}),a=server.GetTitleData({PlayFabId:c,Keys:["BlackMarketResetMinutes","BlackMarketRarityBias"]}),f=JSON.parse(a.Data.BlackMarketRarityBias),e,h=[],b=[],k=[],l=0;l<d.Catalog.length;l++){e=JSON.parse(d.Catalog[l].CustomData);if(void 0==e)return generateErrObj("Part card "+
d.Catalog[l].ItemId+" has no custom data.");0==e.rarity&&h.push(d.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy);1==e.rarity&&b.push(d.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy);2==e.rarity&&k.push(d.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}d={};d.BMTime=(new Date).getTime();l=Math.floor(Math.random()*h.length);d.BMItem0=h[l];2<=h.length&&h.splice(l,1);Math.floor(100*Math.random())<Number(f.parts[2])?
h=k:(l=Number(f.parts[0])+Number(f.parts[1]),Math.floor(Math.random()*l)>=Number(f.parts[0])&&(h=b));d.BMItem1=h[Math.floor(Math.random()*h.length)];e=server.GetCatalogItems({CatalogVersion:"CarCards"});for(var m,h=[],b=[],k=[],l=0;l<e.Catalog.length;l++){m=JSON.parse(e.Catalog[l].CustomData);if(void 0==m)return generateErrObj("Car card "+e.Catalog[l].ItemId+" has no custom data.");Number(m.unlockedAtRank)>=Number(g)+1||("0"==m.rarity&&h.push(e.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+
"_0_"+m.BMpriceIncrPerBuy),"1"==m.rarity&&b.push(e.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy),"2"==m.rarity&&k.push(e.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy))}g=Math.floor(Math.random()*h.length);d.BMItem2=h[g];2<=h.length&&h.splice(g,1);0>=b.length&&(0>=k.length?k=b=h:b=k);0>=k.length&&(k=b);Math.floor(100*Math.random())<Number(f.cars[2])?h=k:(l=Number(f.cars[0])+Number(f.cars[1]),Math.floor(Math.random()*l)>=Number(f.cars[0])&&
(h=b));g=Math.floor(Math.random()*h.length);d.BMItem3=h[g];server.UpdateUserInternalData({PlayFabId:c,Data:d});d.BMTime=60*parseInt(a.Data.BlackMarketResetMinutes);return d}function GetCurrentBlackMarket(c,g){var a={},d=new Date,f=[];f.push("BlackMarketResetMinutes");f=server.GetTitleData({PlayFabId:c,Keys:f});a.BMTime=60*parseInt(f.Data.BlackMarketResetMinutes)-Math.floor((d.getTime()-g.Data.BMTime.Value)/1E3);for(d=0;4>d;d++)a["BMItem"+d]=g.Data["BMItem"+d].Value;return a}
function GetValueFromStatistics(c,g,a){for(var d,f=0;f<c.length;f++)c[f].StatisticName===g&&(d=c[f]);return void 0===d?void 0!==a?a:0:Number(d.Value)}function getCatalogItem(c,g){for(var a=server.GetCatalogItems({CatalogVersion:c}),d=0;d<a.Catalog.length;d++)if(a.Catalog[d].ItemId===g)return a.Catalog[d]}function getObjectValueFromLevel(c,g,a,d){d||(d=0);if(!c[g]||!c[g].length)return d;var f=Number(c[g].length);a>=f&&(a=f-1);return Number(c[g][a])||d}
handlers.buyChest=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(c.curr,c.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<c.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.cost}),d={};d[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",
{VirtualCurrency:d})}return generateInventoryChange("ChestBought",{})};
handlers.endGame=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();var d="01",f,a="0";"rWin"==c.outcome&&(a="1");var e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=e.Statistics.length&&(f=e.Statistics[0].Value.toString(),d=Number(f).toString(2));var e=0,h;h=Array(d.length);for(var b=0;b<h.length-1;b++)h[b]=d[b];h[h.length-1]=a;d=h;a=d.length;for(b=0;b<d.length;b++)"1"==d[b]&&e++;h=Math.round(e/
a*100);var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),a=0,l,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value,log.debug("getting trophy count "+e.Statistics[0].Value));l=a=Number(a);e=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});e=void 0==e.Data.trophyLose||void 0==e.Data.trophyWin?45:Number(e.Data.trophyLose.Value)+Number(e.Data.trophyWin.Value);
"rWin"==c.outcome&&(a+=e);log.debug("trophies change: "+l+" => "+a);e=calculateLeague(a);for(b=f=0;b<d.length;b++)"1"==d[b]&&(f+=Math.pow(2,b));b=[];b.push({StatisticName:"WinLoss",Version:"0",Value:f});d={StatisticName:"TrophyCount",Version:"0",Value:a};b.push(d);d={StatisticName:"League",Version:"0",Value:e};b.push(d);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=JSON.parse(c.recordingHeader);if(10>=Number(b.Score)){var m={TrophyCount:a,League:e};return{Result:m}}b=JSON.parse(c.recordingHeader);
log.debug("score: "+b.Score);d=JSON.parse(k.Data.SubdivisionTrophyRanges);for(b=0;b<d.subdivisions.length;b++)if(l<d.subdivisions[b]){m=b;break}b=[];b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecPos",Value:c.recordingPos});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecRot",Value:c.recordingRot});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecHeader",Value:c.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:b});b=server.GetTitleInternalData({Key:"RecSubDivision"+m}).Data["RecSubDivision"+
m];if(void 0==b)d=[],h={wl:h,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId},d.push(h);else{d=JSON.parse(b);h={wl:h,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId};k=!1;for(b=l=0;b<d.length;b++)d[b].uId==currentPlayerId&&l++;if(2<l)return m={TrophyCount:a,League:e},{Result:m};for(b=0;b<d.length;b++)if(d[b].e==c.envIndex&&d[b].c==c.courseIndex){k=!0;d[b]=h;if(1==d.length)break;if(0<b)if(d[b].wl>d[b-1].wl){if(b==d.length-1)break;for(l=b+1;l<d.length;l++)if(d[l-1].wl>d[l].wl)f=d[l],d[l]=d[l-1],d[l-
1]=f;else break}else for(l=b-1;0<=l;l--)if(d[l+1].wl<d[l].wl)f=d[l],d[l]=d[l+1],d[l+1]=f;else break;else for(l=b+1;l<d.length;l++)if(d[l-1].wl>d[l].wl)f=d[l],d[l]=d[l-1],d[l-1]=f;else break}0==k&&d.push(h)}b=JSON.stringify(d);server.SetTitleInternalData({Key:"RecSubDivision"+m,Value:b});m={TrophyCount:a,League:e};return{Result:m}};
function UpdateExperience(c,g,a,d,f,e){c=JSON.parse(getCatalogItem(c,g).CustomData)[a];g=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds;g=g[g.length-1];e=e||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;e=GetValueFromStatistics(e,"Experience",0);if(e>=g)return g;if(isNaN(Number(c)))a=Number(c.length),d>=a&&(d=a-1),d=Number(c[d]);else if(d=Number(c),0===d)return e;e=Math.min(e+d,g);if(!f)return e;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,
Statistics:[{StatisticName:"Experience",Version:"0",Value:e}]});return e}handlers.getServerTime=function(c,g){return{time:new Date}};
handlers.initServerData=function(c){c=[];var g={StatisticName:"TrophyCount",Version:"0",Value:"0"};c.push(g);g={StatisticName:"League",Version:"0",Value:"0"};c.push(g);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var g={0:"Owned"},a=0;a<c.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[a].ItemInstanceId,Data:g});c=[];c.push("FordFocus");c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});g={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g});g=[];g.push("Engine");g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:g});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});g={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g})};
handlers.openChest=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();if(0<c.levelUpRewardIndex){var d=0,a=server.GetUserReadOnlyData({PlayFabId:currentPlayerId,Keys:["LastLevelReward"]}),f={LastLevelReward:0};void 0==a.Data.LastLevelReward?server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:f}):d=a.Data.LastLevelReward.Value;var e=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds,
a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics,h=GetValueFromStatistics(a,"Experience",0);0==h&&(a=[],a.push({StatisticName:"Experience",Version:"0",Value:0}),server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a}));for(var b=e.length,a=0;a<e.length;a++)if(!(h>=e[a])){b=a;break}if(Number(c.levelUpRewardIndex)<=Number(b))d=Number(c.levelUpRewardIndex),f.LastLevelReward=d,server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:f}),
a=""+d,a="000".substring(0,3-a.length)+a,server.GrantItemsToUser({CatalogVersion:"LevelUpRewards",PlayFabId:currentPlayerId,ItemIds:a});else return generateFailObj("already got reward for level: "+d)}d=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<c.currCost){if("OK"!=checkBalance(c.currType,c.currCost,d.VirtualCurrency.SC,d.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.currType,Amount:c.currCost})}for(var k in c.currencyReq)0<
c.currencyReq[k]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k,Amount:c.currencyReq[k]});for(k in c.carCardsRequest)if(c.carCardsRequest.hasOwnProperty(k)){f=!1;for(a=0;a<d.Inventory.length;a++)if(d.Inventory[a].ItemId==k&&"CarCards"==d.Inventory[a].CatalogVersion){f=void 0==d.Inventory[a].CustomData?Number(c.carCardsRequest[k]):void 0==d.Inventory[a].CustomData.Amount?Number(c.carCardsRequest[k]):isNaN(Number(d.Inventory[a].CustomData.Amount))?Number(c.carCardsRequest[k]):
Number(d.Inventory[a].CustomData.Amount)+Number(c.carCardsRequest[k]);f={Amount:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.Inventory[a].ItemInstanceId,Data:f});f=!0;break}0==f&&(a=[k],a=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:a}),f={Amount:c.carCardsRequest[k]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:f}))}for(k in c.partCardsRequest)if(c.partCardsRequest.hasOwnProperty(k)){f=
!1;for(a=0;a<d.Inventory.length;a++)if(d.Inventory[a].ItemId==k&&"PartCards"==d.Inventory[a].CatalogVersion){f=void 0==d.Inventory[a].CustomData?Number(c.partCardsRequest[k]):void 0==d.Inventory[a].CustomData.Amount?Number(c.partCardsRequest[k]):isNaN(Number(d.Inventory[a].CustomData.Amount))?Number(c.partCardsRequest[k]):Number(d.Inventory[a].CustomData.Amount)+Number(c.partCardsRequest[k]);f={Amount:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.Inventory[a].ItemInstanceId,
Data:f});f=!0;break}0==f&&(a=[k],a=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:a}),f={Amount:c.partCardsRequest[k]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:f}))}k=server.GetUserInventory({PlayFabId:currentPlayerId});c.chestId&&0>=c.levelUpRewardIndex&&(a=UpdateExperience("Chests",c.chestId,"xpGain",0,!0),k.Experience=a);return generateInventoryChange("InventoryUpdated",k)};
handlers.purchaseBMItem=function(c,g){var a="false";c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();if(0>c.itemId||3<c.itemId)return generateFailObj("invalid item index");a=[];a.push("BMItem"+c.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),d=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+c.itemId].Value.split("_"),f=d.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var e;e=2>c.itemId?"PartCards":"CarCards";var h=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),f=checkBalance(a[1],h,f,f);if("OK"!=f)return f;for(var b,k,f=0;f<d.Inventory.length;f++)if(d.Inventory[f].ItemId==a[0]&&d.Inventory[f].CatalogVersion==e){b=d.Inventory[f].ItemInstanceId;void 0===d.Inventory[f].CustomData?k={Amount:1}:void 0===d.Inventory[f].CustomData.Amount?k={Amount:1}:(k=Number(d.Inventory[f].CustomData.Amount)+1,isNaN(k)&&(k=1),k={Amount:k});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b,Data:k});break}void 0===b&&(b=[],b.push(a[0]),b=server.GrantItemsToUser({CatalogVersion:e,PlayFabId:currentPlayerId,ItemIds:b}).ItemGrantResults[0].ItemInstanceId,void 0===b?generateErrObj("grantRequest denied"):(k={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k})));b=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:h});h=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];d={};d["BMItem"+
c.itemId]=h;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:d});k=[{ItemId:a[0],CatalogVersion:e,CustomData:k}];e={};e[b.VirtualCurrency]=b.Balance;a=c.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];f={Inventory:k,VirtualCurrency:e};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:f,BMItemChange:a}};
handlers.purchaseItems=function(c,g){var a=!1;void 0!=c&&(a=c.debug);if(0==a&&"true"==CheckMaintenance())return generateMaintenanceObj();var d=server.GetUserInventory({PlayFabId:currentPlayerId}),f=d.VirtualCurrency.SC,e=d.VirtualCurrency.HC;switch(c.purchaseType){case "carUpgrade":return upgradeCar(c,d,f,e);case "partUpgrade":return upgradePart(c,d,f,e);case "custPurchase":for(var h=server.GetCatalogItems({CatalogVersion:"Customization"}),b,k=0,a="SC",l=0;l<h.Catalog.length;l++)if(h.Catalog[l].ItemId==
c.custId){b=h.Catalog[l];cardInfo=JSON.parse(h.Catalog[l].CustomData);k=c.custVal+",Cost";a=cardInfo[c.custVal+",Curr"];k=cardInfo[k];e=checkBalance(a,k,f,e);if("OK"!=e)return e;break}if(void 0==b)return generateErrObj("Customization does not exist in catalog.");for(var m,n,l=0;l<d.Inventory.length;l++)if(d.Inventory[l].ItemId==c.custId){m=d.Inventory[l];n=d.Inventory[l].ItemInstanceId;if(void 0!=m.CustomData&&String(c.custVal)in m.CustomData)return generateFailObj("User already has this customization.");
break}if(void 0==m){log.info("user doesn't have customization category. Granting ... ");e=[];e.push(c.custId);e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e});if(0==e.ItemGrantResults[0].Result)return generateErrObj("something went wrong while granting user customization class object.");n=e.ItemGrantResults[0].ItemInstanceId}e={};e[String(c.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:n,Data:e});
e=[{ItemId:c.custId,CatalogVersion:"Customization",CustomData:e}];0<k?(a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:k}),k={},k[a.VirtualCurrency]=a.Balance,l={Inventory:e,VirtualCurrency:k}):l={Inventory:e};return generateInventoryChange("InventoryUpdateNewCustomization",l);case "softCurrencyPurchase":a=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});k=!1;for(l=n=0;l<a.Catalog.length;l++)if(a.Catalog[l].ItemId==c.packId){n=a.Catalog[l].VirtualCurrencyPrices.HC;
cardInfo=JSON.parse(a.Catalog[l].CustomData);k=!0;break}if(0==k)return generateErrObj("pack with ID: "+c.packId+" not found in catalog.");if(0>=n)return generateErrObj("pack with ID: "+c.packId+" shouldn't have negative cost.");if(n>e)return generateFailObj("Not enough HC.");a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:n});e=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:cardInfo.quantity});k={};k[e.VirtualCurrency]=
e.Balance;k[a.VirtualCurrency]=a.Balance;return generateInventoryChange("SoftCurrencyPurchased",{VirtualCurrency:k});default:log.debug("invalid purchase parameter")}};handlers.requestCurrency=function(c){var g="false";void 0!=c&&(g=c.debug);return"false"==g&&"true"==CheckMaintenance()?generateMaintenanceObj():{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(c){var g="false";void 0!=c&&(g=c.debug);if("false"==g&&"true"==CheckMaintenance())return generateMaintenanceObj();c=server.GetUserInventory({PlayFabId:currentPlayerId});for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),d=!1,f=0;f<c.Inventory.length;f++)if("CarsProgress"==c.Inventory[f].CatalogVersion){var d=!0,e=checkCarDataValidity(c.Inventory[f],g);if("PlayFabError"==e||void 0===e)return generateErrObj("PlayfabError");
"OK"==e?log.debug("Data for "+c.Inventory[f].ItemId+" OK"):c.Inventory[f].CustomData=e;c.Inventory[f].CustomData.Pr=recalculateCarPr(c.Inventory[f].CustomData,c.Inventory[f].ItemId,g,a);e={};e.Pr=c.Inventory[f].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[f].ItemInstanceId,Data:e})}return!1===d?(c=[],c.push("FordFocus"),c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c}),g={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g}),g={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:g}),g={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,
Data:g}),generateErrObj("UserHasNoCars ... reiniting")):c};
handlers.retrieveBlackMarket=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();a=[];a.push("BMTime");for(var d=0;4>d;d++)a.push("BMItem"+d);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0===a.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var d=new Date,f=[];f.push("BlackMarketResetMinutes");f=server.GetTitleData({PlayFabId:currentPlayerId,Keys:f});if(!0===c.reset){a="HC";d=200;f=server.GetTitleData({Keys:["BlackMarketResetCost"]});
void 0!==f.Data.BlackMarketResetCost&&(d=f.Data.BlackMarketResetCost.split("_"),a=d[0],d=Number(d[1]));if(0<d){f=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,d,f.VirtualCurrency.SC,f.VirtualCurrency.HC))return generateFailObj("not enough money");d=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:d});a=GenerateBlackMarket(currentPlayerId);f={};f[d.VirtualCurrency]=d.Balance;d={VirtualCurrency:f};a.InventoryChange=d;return a}return GenerateBlackMarket(currentPlayerId)}return d.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(f.Data.BlackMarketResetMinutes)?GenerateBlackMarket(currentPlayerId):GetCurrentBlackMarket(currentPlayerId,a)};
handlers.startGame=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();var a="10",d,f=50,e,h=0;e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=e.Statistics.length){d=e.Statistics[0].Value.toString();a=Number(d).toString(2);e=a.length;for(var b=0;b<a.length;b++)"1"==a[b]&&h++;f=Math.round(h/e*100)}a+="0";20<a.length&&(a=a.slice(1));var k=server.GetTitleData({Key:["LeagueSubdivisions",
"SubdivisionTrophyRanges","TrophyGainRange","TrophyLoseRange","SubdivisionPrRanges"]});e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});h=0;0!=e.Statistics.length&&(h=e.Statistics[0].Value);var h=Number(h),l=JSON.parse(k.Data.SubdivisionTrophyRanges);d=JSON.parse(k.Data.LeagueSubdivisions);var m=JSON.parse(k.Data.SubdivisionPrRanges),n=43,u=43;e=k.Data.TrophyGainRange.split("_");var z=k.Data.TrophyLoseRange.split("_"),B=Number(e[0]);e=Number(e[1]);k=Number(z[0]);
z=Number(z[1]);for(b=0;b<l.subdivisions.length;b++)if(h<Number(l.subdivisions[b])){n=b;b<l.subdivisions.length-1&&(u=b+1);break}u=Number(l.subdivisions[u])-Number(l.subdivisions[n]);0>=u&&(u=400);var q=server.GetTitleInternalData({Keys:"RecSubDivision"+n}).Data["RecSubDivision"+n],p=!1;void 0==q&&(p=!0);var w,v=n="noop",r,b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["lastOpp"]});if(void 0==b.Data||void 0==b.Data.lastOpp)v=n="noop";else for(r=b.Data.lastOpp.Value.split(","),b=0;b<
r.length;b++)0==b&&(n=r[b]),1==b&&(v=r[b]);w=0==p?JSON.parse(q):[];var E=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>w.length&&(p=!0);var C=Array(w.length),x=0,q=Array(w.length);r=0;for(var D=Array(w.length),A=0,b=0;b<w.length;b++)1==p&&(E[5*Number(w[b].e)+Number(w[b].c)]=1),w[b].uId!=currentPlayerId&&(C[x]=w[b],x++,w[b].uId!=n&&(q[r]=w[b],r++,w[b].uId!=v&&(D[A]=w[b],A++)));if(1==p){p=[];for(b=0;b<E.length;b++)0==E[b]&&p.push(b);p=p[Math.floor(Math.random()*p.length)];b=Math.floor(p/5);p%=5;v=server.GetTitleData({Keys:"MasterUser"});
if(void 0!=v.Data.MasterUser&&(v=server.GetUserReadOnlyData({PlayFabId:v.Data.MasterUser,Keys:[b+"_"+p+"_RecPos",b+"_"+p+"_RecRot",b+"_"+p+"_RecHeader"]}),void 0!=v.Data&&void 0!=v.Data[b+"_"+p+"_RecPos"]&&void 0!=v.Data[b+"_"+p+"_RecRot"]&&void 0!=v.Data[b+"_"+p+"_RecHeader"])){var y=!0;0==h?(h=e,y=!1):h-=k;1>=h&&(h=1);d=parseInt(a,2);a=[];d={StatisticName:"WinLoss",Version:"0",Value:d};a.push(d);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",
Value:t};a.push(h);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:e,trophyLose:k};0==y&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"TheStig",PosData:v.Data[b+"_"+p+"_RecPos"].Value,RotData:v.Data[b+"_"+p+"_RecRot"].Value,HeaderData:v.Data[b+"_"+p+"_RecHeader"].Value,TrophyLose:k,TrophyWin:e,Opp:"Mniezo"}}}if(0==x)return generateErrObj("no valid recording found for this subdivision");
t=C;0<r&&(x=r,t=q);0<A&&(x=A,t=D);r=x-1;for(b=0;b<x;b++)if(t[b].wl>f){r=b;break}f=Math.min(x,3);q=Array(f);for(b=0;b<f;b++)q[b]=0>=r?t[b]:r>=x-1?t[x-1-b]:t[r-Math.floor(f/2)+b];t=Math.floor(Math.random()*f);b=q[t].uId;f=q[t].e;q=q[t].c;r=server.GetUserReadOnlyData({PlayFabId:b,Keys:[f+"_"+q+"_RecPos",f+"_"+q+"_RecRot",f+"_"+q+"_RecHeader"]});if(void 0==r)return generateErrObj("Did not find recording for this user: "+b);var D=server.GetPlayerCombinedInfo({PlayFabId:b,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),x=h,t=Number(calculateLeague(h)),A="UserGenerated",C=0<t?Number(l.subdivisions[d.leagues[t-1]]):0,v=t>=d.leagues.length-1?2*C:Number(l.subdivisions[d.leagues[t]]),p=JSON.parse(r.Data[f+"_"+q+"_RecHeader"].Value);void 0!=p&&(y=p.Trophies);y=Number(y);0>=v-C?(l=e,y=k):Number(Math.abs(x-y))>Number(u)?(l=Math.floor((k+z)/2),y=Math.floor((e+
B)/2),A="MobyDick"):(l=k+Math.floor((z-k)/2*((x-y)/(v-C)+1)),y=B+Math.floor((e-B)/2*((y-x)/(v-C)+1)));p.Pr>Number(m.subdivisions[d.leagues[t-1]])&&(log.debug("Opponent's PR is TOO DAMN HIGH! "+p.Pr+" vs "+Number(m.subdivisions[d.leagues[t-1]])),A="MobyDick");k=!0;0==h?(k=!1,h=e):(h-=Number(l),1>=h&&(h=1));d=parseInt(a,2);a=[];d={StatisticName:"WinLoss",Version:"0",Value:d};a.push(d);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",Value:t};a.push(h);
server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:y,trophyLose:l,lastOpp:b+","+n};0==k&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:A,PosData:r.Data[f+"_"+q+"_RecPos"].Value,RotData:r.Data[f+"_"+q+"_RecRot"].Value,HeaderData:r.Data[f+"_"+q+"_RecHeader"].Value,TrophyLose:l,TrophyWin:y,Opp:D.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(c,g){var a="false";void 0!=c&&(a=c.debug);if("false"==a&&"true"==CheckMaintenance())return generateMaintenanceObj();for(var d=server.GetUserInventory({PlayFabId:currentPlayerId}),f=[],e="-1",h={},b={PaintJobs:{itemOwned:"no",itemCustData:c.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:c.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:c.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:c.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",
itemCustData:c.wsId,carItemId:"WindshieldId"}},a=0;a<d.Inventory.length;a++)d.Inventory[a].ItemId==c.carId&&"CarsProgress"==d.Inventory[a].CatalogVersion&&(e=d.Inventory[a].ItemInstanceId),d.Inventory[a].ItemId in b&&(b[d.Inventory[a].ItemId].itemOwned="yes",b[d.Inventory[a].ItemId].itemCustData in d.Inventory[a].CustomData?h[b[d.Inventory[a].ItemId].carItemId]=b[d.Inventory[a].ItemId].itemCustData:log.debug("user doesn't own: "+d.Inventory[a].ItemId+" "+b[d.Inventory[a].ItemId].itemCustData));if("-1"==
e)return generateFailObj("User does not own car with id: "+c.carId);for(var k in b)b.hasOwnProperty(k)&&"no"==b[k].itemOwned&&f.push(k);if(h=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e,Data:h});k=[{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:h}];if(0<f.length)for(f=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f}),d={0:"Owned"},
a=0;a<f.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[a].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:k}}};
function upgradeCar(c,g,a,d){for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),e=!1,h,b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarsProgress"==g.Inventory[b].CatalogVersion){e=!0;h=g.Inventory[b];break}for(var k,b=0;b<f.Catalog.length;b++)if(f.Catalog[b].ItemId==c.carId){k=JSON.parse(f.Catalog[b].CustomData);break}if(void 0===k)return generateErrObj("CardNotFoundForCarwithID: "+c.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data.");
if(!0===e){var l=parseInt(h.CustomData.CarLvl)+1;if(l>=Number(k.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var m=getObjectValueFromLevel(k,"currCostPerLvl",l),b=checkBalance(k.currType,m,a,d);if("OK"!=b)return b;a=getObjectValueFromLevel(k,"cardCostPerLvl",l);h.CustomData.CarLvl=l;for(var e=!1,n,b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarCards"==g.Inventory[b].CatalogVersion){e=!0;try{if(void 0===g.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");
if(void 0===g.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(g.Inventory[b].CustomData.Amount)>=a)g.Inventory[b].CustomData.Amount-=a,n={Amount:g.Inventory[b].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[b].ItemInstanceId,Data:n});else return generateFailObj("Insufficient cards for real: "+g.Inventory[b].CustomData.Amount+" vs "+a)}catch(z){return generateFailObj("Insufficient cards")}break}if(!1===
e)return generateFailObj("No cards found");g=recalculateCarPr(h.CustomData,h.ItemId,f,void 0);b={CarLvl:l,Pr:g};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemInstanceId,Data:b});var u;0<m&&(u=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:m}));c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];n={};b={Inventory:c};void 0!=u&&(n[u.VirtualCurrency]=
u.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,l,!0);return generateInventoryChange("InventoryUpdate",b)}e=!1;for(b=0;b<g.Inventory.length;b++)if(g.Inventory[b].ItemId==c.carId&&"CarCards"==g.Inventory[b].CatalogVersion){e=!0;try{if(void 0===g.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0===g.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");
if(Number(g.Inventory[b].CustomData.Amount)>=Number(k.cardCostPerLvl[1]))m=g.Inventory[b].ItemInstanceId,g.Inventory[b].CustomData.Amount-=k.cardCostPerLvl[1],n={Amount:g.Inventory[b].CustomData.Amount};else return generateFailObj("Insufficient cards: "+g.Inventory[b].CustomData.Amount+" vs "+k.cardCostPerLvl[1]+".")}catch(z){return generateFailObj("Insufficient cards: "+z)}break}if(0==e)return generateFailObj("No cards found");b=checkBalance(k.currType,k.currCostPerLvl[1],a,d);if("OK"!=b)return b;
h=[];h.push(c.carId);h=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:h});if(!1===h.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:m,Data:n});0<k.currCostPerLvl[1]&&(u=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k.currType,Amount:k.currCostPerLvl[1]}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});f=h=!1;for(b=0;b<g.Inventory.length;b++)if("PaintJobs"==g.Inventory[b].ItemId){f=!0;void 0!=g.Inventory[b].CustomData?k.defaultPaintID in g.Inventory[b].CustomData?h=!0:(l={},l[k.defaultPaintID]="Owned"):(l={},l[k.defaultPaintID]="Owned");void 0!=l&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[b].ItemInstanceId,
Data:l});break}0==f&&(paintToGive=[],paintToGive.push("PaintJobs"),g=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),l={},l[k.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:l}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];0==h&&(n={},n[k.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:n}));n={};b={Inventory:c};void 0!=u&&(n[u.VirtualCurrency]=u.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,1,!0);return generateInventoryChange("InventoryUpdateNewCar",b)}
function upgradePart(c,g,a,d){for(var f=server.GetCatalogItems({CatalogVersion:"CarsProgress"}),e=!1,h=0;h<f.Catalog.length;h++)if(f.Catalog[h].ItemId==c.carId){e=!0;break}if(!1===e)return generateErrObj("car with ID: "+c.carId+" not found in catalog.");for(var f=server.GetCatalogItems({CatalogVersion:"PartCards"}),e=!1,b,h=0;h<f.Catalog.length;h++)if(f.Catalog[h].ItemId==c.partId){b=JSON.parse(f.Catalog[h].CustomData);e=!0;break}if(0==e)return generateErrObj("part with ID: "+c.partId+" not found in catalog.");
for(var e=!1,k,h=0;h<g.Inventory.length;h++)if(g.Inventory[h].ItemId==c.carId&&"CarsProgress"==g.Inventory[h].CatalogVersion){e=!0;k=g.Inventory[h];break}if(!1===e)return generateFailObj("car with ID: "+c.carId+" not found in user inventory.");for(var l=!1,e=0,m={},h=0;h<g.Inventory.length;h++)if(g.Inventory[h].ItemId==c.partId&&"PartCards"==g.Inventory[h].CatalogVersion){var l=!0,n={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"},
e=parseInt(k.CustomData[n[c.partId]])+1;if(e>=Number(b.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var u=getObjectValueFromLevel(b,"cardCostPerLvl",e),z=getObjectValueFromLevel(b,"currCostPerLvl",e);m[n[c.partId]]=e;k.CustomData[n[c.partId]]=e;var B;a=checkBalance(b.currType,z,a,d);if("OK"!=a)return a;try{if(void 0!==g.Inventory[h].CustomData&&void 0!==g.Inventory[h].CustomData.Amount&&g.Inventory[h].CustomData.Amount>=u)g.Inventory[h].CustomData.Amount-=u,B={Amount:g.Inventory[h].CustomData.Amount},
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.Inventory[h].ItemInstanceId,Data:B});else return generateFailObj("Insufficient cards")}catch(p){return generateFailObj("Insufficient cards")}break}if(0==l)return generateFailObj("Part not found");var q;0<z&&(q=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:z}));h=recalculateCarPr(k.CustomData,k.ItemId,void 0,f);m.Pr=h;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k.ItemInstanceId,Data:m});k={};h={Inventory:[{ItemId:c.partId,CatalogVersion:"PartCards",CustomData:B},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:m}]};void 0!==q&&(k[q.VirtualCurrency]=q.Balance,h.VirtualCurrency=k);h.Experience=UpdateExperience("Balancing","BalancingItem","Parts_"+b.rarity,e,!0);return generateInventoryChange("InventoryUpdatePart",h)};

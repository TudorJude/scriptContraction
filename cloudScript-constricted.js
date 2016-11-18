function checkCarDataValidity(d,h){if(void 0==d.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemInstanceId,Data:a});for(var c=0,e=0;e<h.Catalog.length;e++)if(h.Catalog[e].ItemId==d.ItemId){var f=
JSON.parse(h.Catalog[e].CustomData),c=parseInt(f.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemInstanceId,Data:a})}catch(g){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:c}}return"OK"}function generateFailObj(d){return{Result:"Failed",Message:d}}
function generateErrObj(d){return{Result:"Error",Message:d}}
function CheckMaintenanceAndVersion(d){var h=!1,a="A.0.0.1";void 0!=d&&(h=d.debug,a=d.cVersion);if(void 0==a)return"update";d=server.GetTitleData({Key:["Maintenance","MinimumGameVersionActual_IOS","MinimumGameVersionActual"]});var c=d.Data.MinimumGameVersionActual,a=a.split(".");if(4!=a.length)return"maintenance";"ios"==a[0]&&(c=d.Data.MinimumGameVersionActual_IOS);if(void 0==c)return"maintenance";for(var e=!1,c=c.split("."),f=0;3>f;f++){var g=0;a.length>f+1&&(g=Number(a[f+1]));var b=0;c.length>f&&
(b=Number(c[f]));if(g<b){e=!0;break}}return 1==e?"update":1==h?"OK":d.Data.Maintenance?"false"==d.Data.Maintenance?"OK":"maintenance":"maintenance"}function generateMaintenanceOrUpdateObj(d){return"maintenance"==d?{Result:"Maintenance",Message:"Servers are temporarily offline"}:{Result:"Update",Message:"Game needs to be updated"}}function generateInventoryChange(d,h){return{Result:"OK",Message:d,InventoryChange:h}}
function checkBalance(d,h,a,c){if("SC"==d){if(a<h)return generateFailObj("NotEnoughSC")}else if(c<h)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(d){var h=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==h.Data.LeagueSubdivisions||void 0==h.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(h.Data.LeagueSubdivisions).leagues,h=JSON.parse(h.Data.SubdivisionTrophyRanges).subdivisions,c=0;c<a.length;c++)if(!(Number(d)>Number(h[a[c]])))return c}
function recalculateCarPr(d,h,a,c){var e=0,f;f=void 0===a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<f.Catalog.length;a++)if(f.Catalog[a].ItemId==h){e=JSON.parse(f.Catalog[a].CustomData);e=parseInt(e.basePr)+getObjectValueFromLevel(e,"prPerLvl",d.CarLvl);break}c=void 0===c?server.GetCatalogItems({CatalogVersion:"PartCards"}):c;d={Exhaust:d.ExhaustLvl,Engine:d.EngineLvl,Gearbox:d.GearboxLvl,Suspension:d.SuspensionLvl,Tires:d.TiresLvl,Turbo:d.TurboLvl};for(a=0;a<c.Catalog.length;a++)h=
JSON.parse(c.Catalog[a].CustomData),e+=getObjectValueFromLevel(h,"prPerLvl",Number(d[c.Catalog[a].ItemId]));return e}
function GenerateBlackMarket(d){var h=1,a=server.GetPlayerStatistics({PlayFabId:d,StatisticNames:["League"]});0!=a.Statistics.length&&(h=a.Statistics[0].Value.toString());0>=Number(h)&&(h=1);for(var c=server.GetCatalogItems({CatalogVersion:"PartCards"}),a=server.GetTitleData({PlayFabId:d,Keys:["BlackMarketResetMinutes","BlackMarketRarityBias"]}),e=JSON.parse(a.Data.BlackMarketRarityBias),f,g=[],b=[],k=[],l=0;l<c.Catalog.length;l++){f=JSON.parse(c.Catalog[l].CustomData);if(void 0==f)return generateErrObj("Part card "+
c.Catalog[l].ItemId+" has no custom data.");0==f.rarity&&g.push(c.Catalog[l].ItemId+"_"+f.BMCurrType+"_"+f.BMbasePrice+"_0_"+f.BMpriceIncrPerBuy);1==f.rarity&&b.push(c.Catalog[l].ItemId+"_"+f.BMCurrType+"_"+f.BMbasePrice+"_0_"+f.BMpriceIncrPerBuy);2==f.rarity&&k.push(c.Catalog[l].ItemId+"_"+f.BMCurrType+"_"+f.BMbasePrice+"_0_"+f.BMpriceIncrPerBuy)}c={};c.BMTime=(new Date).getTime();l=Math.floor(Math.random()*g.length);c.BMItem0=g[l];2<=g.length&&g.splice(l,1);Math.floor(100*Math.random())<Number(e.parts[2])?
g=k:(l=Number(e.parts[0])+Number(e.parts[1]),Math.floor(Math.random()*l)>=Number(e.parts[0])&&(g=b));c.BMItem1=g[Math.floor(Math.random()*g.length)];f=server.GetCatalogItems({CatalogVersion:"CarCards"});for(var m,g=[],b=[],k=[],l=0;l<f.Catalog.length;l++){m=JSON.parse(f.Catalog[l].CustomData);if(void 0==m)return generateErrObj("Car card "+f.Catalog[l].ItemId+" has no custom data.");Number(m.unlockedAtRank)>=Number(h)+1||("0"==m.rarity&&g.push(f.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+
"_0_"+m.BMpriceIncrPerBuy),"1"==m.rarity&&b.push(f.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy),"2"==m.rarity&&k.push(f.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy))}h=Math.floor(Math.random()*g.length);c.BMItem2=g[h];2<=g.length&&g.splice(h,1);0>=b.length&&(0>=k.length?k=b=g:b=k);0>=k.length&&(k=b);Math.floor(100*Math.random())<Number(e.cars[2])?g=k:(l=Number(e.cars[0])+Number(e.cars[1]),Math.floor(Math.random()*l)>=Number(e.cars[0])&&
(g=b));h=Math.floor(Math.random()*g.length);c.BMItem3=g[h];server.UpdateUserInternalData({PlayFabId:d,Data:c});c.BMTime=60*parseInt(a.Data.BlackMarketResetMinutes);return c}function GetCurrentBlackMarket(d,h){var a={},c=new Date,e=[];e.push("BlackMarketResetMinutes");e=server.GetTitleData({PlayFabId:d,Keys:e});a.BMTime=60*parseInt(e.Data.BlackMarketResetMinutes)-Math.floor((c.getTime()-h.Data.BMTime.Value)/1E3);for(c=0;4>c;c++)a["BMItem"+c]=h.Data["BMItem"+c].Value;return a}
function GetValueFromStatistics(d,h,a){for(var c,e=0;e<d.length;e++)d[e].StatisticName===h&&(c=d[e]);log.debug("Stat with name statisticsName: "+h+" is "+c);return void 0===c?void 0!==a?a:0:Number(c.Value)}function getCatalogItem(d,h){for(var a=server.GetCatalogItems({CatalogVersion:d}),c=0;c<a.Catalog.length;c++)if(a.Catalog[c].ItemId===h)return a.Catalog[c]}
function getObjectValueFromLevel(d,h,a,c){c||(c=0);if(!d[h]||!d[h].length)return c;var e=Number(d[h].length);a>=e&&(a=e-1);return Number(d[h][a])||c}
handlers.buyChest=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(d.curr,d.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<d.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:d.curr,Amount:d.cost}),c={};c[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",{VirtualCurrency:c})}return generateInventoryChange("ChestBought",
{})};
handlers.endGame=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var c="01",e,f="0";"rWin"==d.outcome&&(f="1");a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=a.Statistics.length&&(e=a.Statistics[0].Value.toString(),c=Number(e).toString(2));var a=0,g;g=Array(c.length);for(var b=0;b<g.length-1;b++)g[b]=c[b];g[g.length-1]=f;c=g;g=c.length;for(var k=f=0,b=0;b<c.length;b++)"1"==c[b]?(a++,log.debug("wins "+a),
k++):(log.debug("winStreak "+k),k>f&&(f=k),k=0);g=Math.round(a/g*100);var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),a=0,l,b=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=b.Statistics.length&&(a=b.Statistics[0].Value,log.debug("getting trophy count "+b.Statistics[0].Value));l=a=Number(a);b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});b=void 0==b.Data.trophyLose||void 0==b.Data.trophyWin?
45:Number(b.Data.trophyLose.Value)+Number(b.Data.trophyWin.Value);"rWin"==d.outcome&&(a+=b);var m=JSON.parse(d.recordingHeader),b=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Wins","TotalGamesCompleted","LongestWinStreak","BestDriftScore"]}).Statistics,n=GetValueFromStatistics(b,"TotalGamesCompleted",0),n=Number(n)+1,p=GetValueFromStatistics(b,"Wins",0);"rWin"==d.outcome&&(p=Number(p)+1);var y=GetValueFromStatistics(b,"LongestWinStreak",0);f>y&&(y=f);var v=GetValueFromStatistics(b,
"BestDriftScore",0);Number(m.Score)>v&&(v=Number(m.Score));f=calculateLeague(a);for(b=e=0;b<c.length;b++)"1"==c[b]&&(e+=Math.pow(2,b));b=[];b.push({StatisticName:"WinLoss",Version:"0",Value:e});c={StatisticName:"TrophyCount",Version:"0",Value:a};b.push(c);c={StatisticName:"League",Version:"0",Value:f};b.push(c);c={StatisticName:"Wins",Version:"0",Value:p};b.push(c);c={StatisticName:"TotalGamesCompleted",Version:"0",Value:n};b.push(c);c={StatisticName:"LongestWinStreak",Version:"0",Value:y};b.push(c);
c={StatisticName:"BestDriftScore",Version:"0",Value:v};b.push(c);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});if(10>=Number(m.Score)){var r={TrophyCount:a,League:f};return{Result:r}}c=JSON.parse(k.Data.SubdivisionTrophyRanges);for(b=0;b<c.subdivisions.length;b++)if(l<c.subdivisions[b]){r=b;break}b=[];b.push({Key:d.envIndex+"_"+d.courseIndex+"_RecPos",Value:d.recordingPos});b.push({Key:d.envIndex+"_"+d.courseIndex+"_RecRot",Value:d.recordingRot});b.push({Key:d.envIndex+"_"+
d.courseIndex+"_RecHeader",Value:d.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:b});b=server.GetTitleInternalData({Key:"RecSubDivision"+r}).Data["RecSubDivision"+r];if(void 0==b)c=[],g={wl:g,e:d.envIndex,c:d.courseIndex,uId:currentPlayerId},c.push(g);else{c=JSON.parse(b);g={wl:g,e:d.envIndex,c:d.courseIndex,uId:currentPlayerId};k=!1;for(b=l=0;b<c.length;b++)c[b].uId==currentPlayerId&&l++;if(2<l)return r={TrophyCount:a,League:f},{Result:r};for(b=0;b<c.length;b++)if(c[b].e==
d.envIndex&&c[b].c==d.courseIndex){k=!0;c[b]=g;if(1==c.length)break;if(0<b)if(c[b].wl>c[b-1].wl){if(b==c.length-1)break;for(l=b+1;l<c.length;l++)if(c[l-1].wl>c[l].wl)m=c[l],c[l]=c[l-1],c[l-1]=m;else break}else for(l=b-1;0<=l;l--)if(c[l+1].wl<c[l].wl)m=c[l],c[l]=c[l+1],c[l+1]=m;else break;else for(l=b+1;l<c.length;l++)if(c[l-1].wl>c[l].wl)m=c[l],c[l]=c[l-1],c[l-1]=m;else break}0==k&&c.push(g)}b=JSON.stringify(c);server.SetTitleInternalData({Key:"RecSubDivision"+r,Value:b});r={TrophyCount:a,League:f};
return{Result:r}};
function UpdateExperience(d,h,a,c,e,f){d=JSON.parse(getCatalogItem(d,h).CustomData)[a];h=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds;h=h[h.length-1];f=f||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;f=GetValueFromStatistics(f,"Experience",0);if(f>=h)return h;if(isNaN(Number(d)))a=Number(d.length),c>=a&&(c=a-1),c=Number(d[c]);else if(c=Number(d),0===c)return f;f=Math.min(f+c,h);if(!e)return f;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,
Statistics:[{StatisticName:"Experience",Version:"0",Value:f}]});return f}handlers.getServerTime=function(d,h){return{time:new Date}};
handlers.initServerData=function(d){d=[];var h={StatisticName:"TrophyCount",Version:"0",Value:"0"};d.push(h);h={StatisticName:"League",Version:"0",Value:"0"};d.push(h);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:d});d=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var h={0:"Owned"},a=0;a<d.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemGrantResults[a].ItemInstanceId,Data:h});d=[];d.push("FordFocus");d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:d});h={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h});h={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h});h={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h});h=[];h.push("Engine");h=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:h});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});h={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h})};
handlers.openChest=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);if(0<d.levelUpRewardIndex){var c=0,a=server.GetUserReadOnlyData({PlayFabId:currentPlayerId,Keys:["LastLevelReward"]}),e={LastLevelReward:0};void 0==a.Data.LastLevelReward?server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:e}):c=a.Data.LastLevelReward.Value;var f=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds,a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["Experience"]}).Statistics,g=GetValueFromStatistics(a,"Experience",0);0==g&&(a=[],a.push({StatisticName:"Experience",Version:"0",Value:0}),server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a}));for(var b=f.length,a=0;a<f.length;a++)if(!(g>=f[a])){b=a;break}if(Number(d.levelUpRewardIndex)<=Number(b))c=Number(d.levelUpRewardIndex),e.LastLevelReward=c,server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:e}),a=""+c,a="000".substring(0,3-a.length)+a,server.GrantItemsToUser({CatalogVersion:"LevelUpRewards",
PlayFabId:currentPlayerId,ItemIds:a});else return generateFailObj("already got reward for level: "+c)}c=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<d.currCost){if("OK"!=checkBalance(d.currType,d.currCost,c.VirtualCurrency.SC,c.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:d.currType,Amount:d.currCost})}for(var k in d.currencyReq)0<d.currencyReq[k]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k,Amount:d.currencyReq[k]});for(k in d.carCardsRequest)if(d.carCardsRequest.hasOwnProperty(k)){e=!1;for(a=0;a<c.Inventory.length;a++)if(c.Inventory[a].ItemId==k&&"CarCards"==c.Inventory[a].CatalogVersion){e=void 0==c.Inventory[a].CustomData?Number(d.carCardsRequest[k]):void 0==c.Inventory[a].CustomData.Amount?Number(d.carCardsRequest[k]):isNaN(Number(c.Inventory[a].CustomData.Amount))?Number(d.carCardsRequest[k]):Number(c.Inventory[a].CustomData.Amount)+Number(d.carCardsRequest[k]);
e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[a].ItemInstanceId,Data:e});e=!0;break}0==e&&(a=[k],a=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:a}),e={Amount:d.carCardsRequest[k]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:e}))}for(k in d.partCardsRequest)if(d.partCardsRequest.hasOwnProperty(k)){e=!1;for(a=0;a<c.Inventory.length;a++)if(c.Inventory[a].ItemId==
k&&"PartCards"==c.Inventory[a].CatalogVersion){e=void 0==c.Inventory[a].CustomData?Number(d.partCardsRequest[k]):void 0==c.Inventory[a].CustomData.Amount?Number(d.partCardsRequest[k]):isNaN(Number(c.Inventory[a].CustomData.Amount))?Number(d.partCardsRequest[k]):Number(c.Inventory[a].CustomData.Amount)+Number(d.partCardsRequest[k]);e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[a].ItemInstanceId,Data:e});e=!0;break}0==e&&(a=[k],a=server.GrantItemsToUser({CatalogVersion:"PartCards",
PlayFabId:currentPlayerId,ItemIds:a}),e={Amount:d.partCardsRequest[k]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:e}))}k=server.GetUserInventory({PlayFabId:currentPlayerId});d.chestId&&0>=d.levelUpRewardIndex&&(a=UpdateExperience("Chests",d.chestId,"xpGain",0,!0),k.Experience=a);return generateInventoryChange("InventoryUpdated",k)};
handlers.purchaseBMItem=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);if(0>d.itemId||3<d.itemId)return generateFailObj("invalid item index");a=[];a.push("BMItem"+d.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),c=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+d.itemId].Value.split("_"),e=c.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var f;f=2>d.itemId?"PartCards":"CarCards";var g=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),e=checkBalance(a[1],g,e,e);if("OK"!=e)return e;for(var b,k,e=0;e<c.Inventory.length;e++)if(c.Inventory[e].ItemId==a[0]&&c.Inventory[e].CatalogVersion==f){b=c.Inventory[e].ItemInstanceId;void 0===c.Inventory[e].CustomData?k={Amount:1}:void 0===c.Inventory[e].CustomData.Amount?k={Amount:1}:(k=Number(c.Inventory[e].CustomData.Amount)+1,isNaN(k)&&(k=1),k={Amount:k});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b,Data:k});break}void 0===b&&(b=[],b.push(a[0]),b=server.GrantItemsToUser({CatalogVersion:f,PlayFabId:currentPlayerId,ItemIds:b}).ItemGrantResults[0].ItemInstanceId,void 0===b?generateErrObj("grantRequest denied"):(k={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k})));b=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:g});g=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];c={};c["BMItem"+
d.itemId]=g;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:c});k=[{ItemId:a[0],CatalogVersion:f,CustomData:k}];f={};f[b.VirtualCurrency]=b.Balance;a=d.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={Inventory:k,VirtualCurrency:f};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:e,BMItemChange:a}};
handlers.purchaseItems=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var c=server.GetUserInventory({PlayFabId:currentPlayerId}),e=c.VirtualCurrency.SC,f=c.VirtualCurrency.HC;switch(d.purchaseType){case "carUpgrade":return upgradeCar(d,c,e,f);case "partUpgrade":return upgradePart(d,c,e,f);case "custPurchase":for(var g=server.GetCatalogItems({CatalogVersion:"Customization"}),b,k=0,a="SC",l=0;l<g.Catalog.length;l++)if(g.Catalog[l].ItemId==d.custId){b=
g.Catalog[l];cardInfo=JSON.parse(g.Catalog[l].CustomData);k=d.custVal+",Cost";a=cardInfo[d.custVal+",Curr"];k=cardInfo[k];f=checkBalance(a,k,e,f);if("OK"!=f)return f;break}if(void 0==b)return generateErrObj("Customization does not exist in catalog.");for(var m,n,l=0;l<c.Inventory.length;l++)if(c.Inventory[l].ItemId==d.custId){m=c.Inventory[l];n=c.Inventory[l].ItemInstanceId;if(void 0!=m.CustomData&&String(d.custVal)in m.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==
m){log.info("user doesn't have customization category. Granting ... ");f=[];f.push(d.custId);f=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f});if(0==f.ItemGrantResults[0].Result)return generateErrObj("something went wrong while granting user customization class object.");n=f.ItemGrantResults[0].ItemInstanceId}f={};f[String(d.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:n,Data:f});f=[{ItemId:d.custId,
CatalogVersion:"Customization",CustomData:f}];0<k?(a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:k}),k={},k[a.VirtualCurrency]=a.Balance,l={Inventory:f,VirtualCurrency:k}):l={Inventory:f};return generateInventoryChange("InventoryUpdateNewCustomization",l);case "softCurrencyPurchase":a=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});k=!1;for(l=n=0;l<a.Catalog.length;l++)if(a.Catalog[l].ItemId==d.packId){n=a.Catalog[l].VirtualCurrencyPrices.HC;
cardInfo=JSON.parse(a.Catalog[l].CustomData);k=!0;break}if(0==k)return generateErrObj("pack with ID: "+d.packId+" not found in catalog.");if(0>=n)return generateErrObj("pack with ID: "+d.packId+" shouldn't have negative cost.");if(n>f)return generateFailObj("Not enough HC.");a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:n});f=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:cardInfo.quantity});k={};k[f.VirtualCurrency]=
f.Balance;k[a.VirtualCurrency]=a.Balance;return generateInventoryChange("SoftCurrencyPurchased",{VirtualCurrency:k});default:log.debug("invalid purchase parameter")}};handlers.requestCurrency=function(d){d=CheckMaintenanceAndVersion(d);return"OK"!=d?generateMaintenanceOrUpdateObj(d):{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(d){d=server.GetUserInventory({PlayFabId:currentPlayerId});for(var h=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),c=!1,e=0;e<d.Inventory.length;e++)if("CarsProgress"==d.Inventory[e].CatalogVersion){var c=!0,f=checkCarDataValidity(d.Inventory[e],h);if("PlayFabError"==f||void 0===f)return generateErrObj("PlayfabError");"OK"==f?log.debug("Data for "+d.Inventory[e].ItemId+" OK"):d.Inventory[e].CustomData=f;
d.Inventory[e].CustomData.Pr=recalculateCarPr(d.Inventory[e].CustomData,d.Inventory[e].ItemId,h,a);f={};f.Pr=d.Inventory[e].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.Inventory[e].ItemInstanceId,Data:f})}return!1===c?(d=[],d.push("FordFocus"),d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:d}),h={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h}),h={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h}),h={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:h}),generateErrObj("UserHasNoCars ... reiniting")):d};
handlers.retrieveBlackMarket=function(d,h){var a=CheckMaintenanceAndVersion(d);if(!0===d.reset&&"OK"!=a)return generateMaintenanceOrUpdateObj(a);var c=[];c.push("BMTime");for(var e=0;4>e;e++)c.push("BMItem"+e);e=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:c});if(void 0===e.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var c=new Date,f=[];f.push("BlackMarketResetMinutes");f=server.GetTitleData({PlayFabId:currentPlayerId,Keys:f});if(!0===d.reset){a="HC";e=200;c=server.GetTitleData({Keys:["BlackMarketResetCost"]});
void 0!==c.Data.BlackMarketResetCost&&(e=c.Data.BlackMarketResetCost.split("_"),a=e[0],e=Number(e[1]));if(0<e){c=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,e,c.VirtualCurrency.SC,c.VirtualCurrency.HC))return generateFailObj("not enough money");e=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:e});a=GenerateBlackMarket(currentPlayerId);c={};c[e.VirtualCurrency]=e.Balance;e={VirtualCurrency:c};a.InventoryChange=e;return a}return GenerateBlackMarket(currentPlayerId)}return c.getTime()-
parseInt(e.Data.BMTime.Value)>6E4*parseInt(f.Data.BlackMarketResetMinutes)?("OK"!=a&&GetCurrentBlackMarket(currentPlayerId,e),GenerateBlackMarket(currentPlayerId)):GetCurrentBlackMarket(currentPlayerId,e)};
handlers.rewardUsers=function(d,h){var a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience","TrophyCount"]}).Statistics,c=GetValueFromStatistics(a,"Experience",0),a=GetValueFromStatistics(a,"TrophyCount",0),e=0;0>=c&&(a=Number(a)/3E3,e=Number(Math.floor(800*a)));c=Number(c)+e;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:[{StatisticName:"Experience",Version:"0",Value:c}]});return c};
handlers.startGame=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var c="10",e,f=50,g,a=0;g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){e=g.Statistics[0].Value.toString();c=Number(e).toString(2);g=c.length;for(var b=0;b<c.length;b++)"1"==c[b]&&a++;f=Math.round(a/g*100)}c+="0";20<c.length&&(c=c.slice(1));var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges",
"TrophyGainRange","TrophyLoseRange","SubdivisionPrRanges"]}),a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TotalGames"]}).Statistics,a=GetValueFromStatistics(a,"TotalGames",0),a=Number(a)+1,l=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});g=0;0!=l.Statistics.length&&(g=l.Statistics[0].Value);g=Number(g);var m=JSON.parse(k.Data.SubdivisionTrophyRanges);e=JSON.parse(k.Data.LeagueSubdivisions);for(var n=JSON.parse(k.Data.SubdivisionPrRanges),
p=43,y=43,v=k.Data.TrophyGainRange.split("_"),r=k.Data.TrophyLoseRange.split("_"),l=Number(v[0]),k=Number(v[1]),v=Number(r[0]),r=Number(r[1]),b=0;b<m.subdivisions.length;b++)if(g<Number(m.subdivisions[b])){p=b;b<m.subdivisions.length-1&&(y=b+1);break}y=Number(m.subdivisions[y])-Number(m.subdivisions[p]);0>=y&&(y=400);var u=server.GetTitleInternalData({Keys:"RecSubDivision"+p}).Data["RecSubDivision"+p],q=!1;void 0==u&&(q=!0);var z,w=p="noop",t,b=server.GetUserInternalData({PlayFabId:currentPlayerId,
Keys:["lastOpp"]});if(void 0==b.Data||void 0==b.Data.lastOpp)w=p="noop";else for(t=b.Data.lastOpp.Value.split(","),b=0;b<t.length;b++)0==b&&(p=t[b]),1==b&&(w=t[b]);z=0==q?JSON.parse(u):[];var F=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>z.length&&(q=!0);var D=Array(z.length),A=0,u=Array(z.length);t=0;for(var E=Array(z.length),C=0,b=0;b<z.length;b++)1==q&&(F[5*Number(z[b].e)+Number(z[b].c)]=1),z[b].uId!=currentPlayerId&&(D[A]=z[b],A++,z[b].uId!=p&&(u[t]=z[b],t++,z[b].uId!=w&&(E[C]=z[b],C++)));if(1==q){q=[];
for(b=0;b<F.length;b++)0==F[b]&&q.push(b);q=q[Math.floor(Math.random()*q.length)];b=Math.floor(q/5);q%=5;w=server.GetTitleData({Keys:"MasterUser"});if(void 0!=w.Data.MasterUser&&(w=server.GetUserReadOnlyData({PlayFabId:w.Data.MasterUser,Keys:[b+"_"+q+"_RecPos",b+"_"+q+"_RecRot",b+"_"+q+"_RecHeader"]}),void 0!=w.Data&&void 0!=w.Data[b+"_"+q+"_RecPos"]&&void 0!=w.Data[b+"_"+q+"_RecRot"]&&void 0!=w.Data[b+"_"+q+"_RecHeader"])){var B=!0;0==g?(g=k,B=!1):g-=v;1>=g&&(g=1);e=parseInt(c,2);c=[];e={StatisticName:"WinLoss",
Version:"0",Value:e};c.push(e);g={StatisticName:"TrophyCount",Version:"0",Value:g};c.push(g);g={StatisticName:"League",Version:"0",Value:x};c.push(g);g={StatisticName:"TotalGames",Version:"0",Value:a};c.push(g);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});a={trophyWin:Math.floor((Number(k)+Number(l))/2),trophyLose:Math.floor((Number(r)+Number(v))/2)};0==B&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",
RecType:"TheStig",PosData:w.Data[b+"_"+q+"_RecPos"].Value,RotData:w.Data[b+"_"+q+"_RecRot"].Value,HeaderData:w.Data[b+"_"+q+"_RecHeader"].Value,TrophyLose:v,TrophyWin:k,Opp:"Mniezo"}}}if(0==A)return generateErrObj("no valid recording found for this subdivision");x=D;0<t&&(A=t,x=u);0<C&&(A=C,x=E);t=A-1;for(b=0;b<A;b++)if(x[b].wl>f){t=b;break}f=Math.min(A,3);u=Array(f);for(b=0;b<f;b++)u[b]=0>=t?x[b]:t>=A-1?x[A-1-b]:x[t-Math.floor(f/2)+b];x=Math.floor(Math.random()*f);b=u[x].uId;f=u[x].e;u=u[x].c;t=
server.GetUserReadOnlyData({PlayFabId:b,Keys:[f+"_"+u+"_RecPos",f+"_"+u+"_RecRot",f+"_"+u+"_RecHeader"]});if(void 0==t)return generateErrObj("Did not find recording for this user: "+b);var E=server.GetPlayerCombinedInfo({PlayFabId:b,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=g,x=Number(calculateLeague(g)),C="UserGenerated",
D=0<x?Number(m.subdivisions[e.leagues[x-1]]):0,w=x>=e.leagues.length-1?2*D:Number(m.subdivisions[e.leagues[x]]),q=JSON.parse(t.Data[f+"_"+u+"_RecHeader"].Value);void 0!=q&&(B=q.Trophies);B=Number(B);0>=w-D?(m=r,B=l):Number(Math.abs(A-B))>Number(y)?(m=Math.floor((v+r)/2)-1+Math.floor(3*Math.random()),B=Math.floor((k+l)/2)-1+Math.floor(3*Math.random()),C="MobyDick"):(m=v+Math.floor((r-v)/2*((A-B)/(w-D)+1)),B=l+Math.floor((k-l)/2*((B-A)/(w-D)+1)));q.Pr>Number(n.subdivisions[e.leagues[x-1]])&&(m=Math.floor((v+
r)/2)-1+Math.floor(3*Math.random()),B=Math.floor((k+l)/2)-1+Math.floor(3*Math.random()),C="MobyDick");l=!0;0==g?(l=!1,g=k):(g-=Number(m),1>=g&&(g=1));e=parseInt(c,2);c=[];e={StatisticName:"WinLoss",Version:"0",Value:e};c.push(e);g={StatisticName:"TrophyCount",Version:"0",Value:g};c.push(g);g={StatisticName:"League",Version:"0",Value:x};c.push(g);g={StatisticName:"TotalGames",Version:"0",Value:a};c.push(g);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});a={trophyWin:B,trophyLose:m,
lastOpp:b+","+p};0==l&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:C,PosData:t.Data[f+"_"+u+"_RecPos"].Value,RotData:t.Data[f+"_"+u+"_RecRot"].Value,HeaderData:t.Data[f+"_"+u+"_RecHeader"].Value,TrophyLose:m,TrophyWin:B,Opp:E.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(d,h){var a=CheckMaintenanceAndVersion(d);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);for(var c=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],f="-1",g={},b={PaintJobs:{itemOwned:"no",itemCustData:d.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:d.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:d.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:d.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",
itemCustData:d.wsId,carItemId:"WindshieldId"}},a=0;a<c.Inventory.length;a++)c.Inventory[a].ItemId==d.carId&&"CarsProgress"==c.Inventory[a].CatalogVersion&&(f=c.Inventory[a].ItemInstanceId),c.Inventory[a].ItemId in b&&(b[c.Inventory[a].ItemId].itemOwned="yes",b[c.Inventory[a].ItemId].itemCustData in c.Inventory[a].CustomData?g[b[c.Inventory[a].ItemId].carItemId]=b[c.Inventory[a].ItemId].itemCustData:log.debug("user doesn't own: "+c.Inventory[a].ItemId+" "+b[c.Inventory[a].ItemId].itemCustData));if("-1"==
f)return generateFailObj("User does not own car with id: "+d.carId);for(var k in b)b.hasOwnProperty(k)&&"no"==b[k].itemOwned&&e.push(k);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f,Data:g});k=[{ItemId:d.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),c={0:"Owned"},
a=0;a<e.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[a].ItemInstanceId,Data:c});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:k}}};
function upgradeCar(d,h,a,c){for(var e=server.GetCatalogItems({CatalogVersion:"CarCards"}),f=!1,g,b=0;b<h.Inventory.length;b++)if(h.Inventory[b].ItemId==d.carId&&"CarsProgress"==h.Inventory[b].CatalogVersion){f=!0;g=h.Inventory[b];break}for(var k,b=0;b<e.Catalog.length;b++)if(e.Catalog[b].ItemId==d.carId){k=JSON.parse(e.Catalog[b].CustomData);break}if(void 0===k)return generateErrObj("CardNotFoundForCarwithID: "+d.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data.");
if(!0===f){var l=parseInt(g.CustomData.CarLvl)+1;if(l>=Number(k.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var m=getObjectValueFromLevel(k,"currCostPerLvl",l),b=checkBalance(k.currType,m,a,c);if("OK"!=b)return b;a=getObjectValueFromLevel(k,"cardCostPerLvl",l);g.CustomData.CarLvl=l;for(var f=!1,n,b=0;b<h.Inventory.length;b++)if(h.Inventory[b].ItemId==d.carId&&"CarCards"==h.Inventory[b].CatalogVersion){f=!0;try{if(void 0===h.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");
if(void 0===h.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(h.Inventory[b].CustomData.Amount)>=a)h.Inventory[b].CustomData.Amount-=a,n={Amount:h.Inventory[b].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[b].ItemInstanceId,Data:n});else return generateFailObj("Insufficient cards for real: "+h.Inventory[b].CustomData.Amount+" vs "+a)}catch(y){return generateFailObj("Insufficient cards")}break}if(!1===
f)return generateFailObj("No cards found");h=recalculateCarPr(g.CustomData,g.ItemId,e,void 0);b={CarLvl:l,Pr:h};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,Data:b});var p;0<m&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:m}));d=[{ItemId:d.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:d.carId,CatalogVersion:"CarsProgress",CustomData:b}];n={};b={Inventory:d};void 0!=p&&(n[p.VirtualCurrency]=
p.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,l,!0);return generateInventoryChange("InventoryUpdate",b)}f=!1;for(b=0;b<h.Inventory.length;b++)if(h.Inventory[b].ItemId==d.carId&&"CarCards"==h.Inventory[b].CatalogVersion){f=!0;try{if(void 0===h.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0===h.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");
if(Number(h.Inventory[b].CustomData.Amount)>=Number(k.cardCostPerLvl[1]))m=h.Inventory[b].ItemInstanceId,h.Inventory[b].CustomData.Amount-=k.cardCostPerLvl[1],n={Amount:h.Inventory[b].CustomData.Amount};else return generateFailObj("Insufficient cards: "+h.Inventory[b].CustomData.Amount+" vs "+k.cardCostPerLvl[1]+".")}catch(y){return generateFailObj("Insufficient cards: "+y)}break}if(0==f)return generateFailObj("No cards found");b=checkBalance(k.currType,k.currCostPerLvl[1],a,c);if("OK"!=b)return b;
g=[];g.push(d.carId);g=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:g});if(!1===g.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:m,Data:n});0<k.currCostPerLvl[1]&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k.currType,Amount:k.currCostPerLvl[1]}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:b});b={TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:b});b={PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:b});e=g=!1;for(b=0;b<h.Inventory.length;b++)if("PaintJobs"==h.Inventory[b].ItemId){e=!0;void 0!=h.Inventory[b].CustomData?k.defaultPaintID in h.Inventory[b].CustomData?g=!0:(l={},l[k.defaultPaintID]="Owned"):(l={},l[k.defaultPaintID]="Owned");void 0!=l&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[b].ItemInstanceId,
Data:l});break}0==e&&(paintToGive=[],paintToGive.push("PaintJobs"),h=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),l={},l[k.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:l}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};d=[{ItemId:d.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:d.carId,CatalogVersion:"CarsProgress",CustomData:b}];0==g&&(n={},n[k.defaultPaintID]="Owned",d.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:n}));n={};b={Inventory:d};void 0!=p&&(n[p.VirtualCurrency]=p.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,1,!0);return generateInventoryChange("InventoryUpdateNewCar",b)}
function upgradePart(d,h,a,c){for(var e=server.GetCatalogItems({CatalogVersion:"CarsProgress"}),f=!1,g=0;g<e.Catalog.length;g++)if(e.Catalog[g].ItemId==d.carId){f=!0;break}if(!1===f)return generateErrObj("car with ID: "+d.carId+" not found in catalog.");for(var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),f=!1,b,g=0;g<e.Catalog.length;g++)if(e.Catalog[g].ItemId==d.partId){b=JSON.parse(e.Catalog[g].CustomData);f=!0;break}if(0==f)return generateErrObj("part with ID: "+d.partId+" not found in catalog.");
for(var f=!1,k,g=0;g<h.Inventory.length;g++)if(h.Inventory[g].ItemId==d.carId&&"CarsProgress"==h.Inventory[g].CatalogVersion){f=!0;k=h.Inventory[g];break}if(!1===f)return generateFailObj("car with ID: "+d.carId+" not found in user inventory.");for(var l=!1,f=0,m={},g=0;g<h.Inventory.length;g++)if(h.Inventory[g].ItemId==d.partId&&"PartCards"==h.Inventory[g].CatalogVersion){var l=!0,n={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"},
f=parseInt(k.CustomData[n[d.partId]])+1;if(f>=Number(b.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var p=getObjectValueFromLevel(b,"cardCostPerLvl",f),y=getObjectValueFromLevel(b,"currCostPerLvl",f);m[n[d.partId]]=f;k.CustomData[n[d.partId]]=f;var v;a=checkBalance(b.currType,y,a,c);if("OK"!=a)return a;try{if(void 0!==h.Inventory[g].CustomData&&void 0!==h.Inventory[g].CustomData.Amount&&h.Inventory[g].CustomData.Amount>=p)h.Inventory[g].CustomData.Amount-=p,v={Amount:h.Inventory[g].CustomData.Amount},
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[g].ItemInstanceId,Data:v});else return generateFailObj("Insufficient cards")}catch(u){return generateFailObj("Insufficient cards")}break}if(0==l)return generateFailObj("Part not found");var r;0<y&&(r=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:y}));g=recalculateCarPr(k.CustomData,k.ItemId,void 0,e);m.Pr=g;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k.ItemInstanceId,Data:m});k={};g={Inventory:[{ItemId:d.partId,CatalogVersion:"PartCards",CustomData:v},{ItemId:d.carId,CatalogVersion:"CarsProgress",CustomData:m}]};void 0!==r&&(k[r.VirtualCurrency]=r.Balance,g.VirtualCurrency=k);g.Experience=UpdateExperience("Balancing","BalancingItem","Parts_"+b.rarity,f,!0);return generateInventoryChange("InventoryUpdatePart",g)};

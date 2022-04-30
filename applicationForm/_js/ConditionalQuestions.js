var aAttributeItems=new Array();var aAttributeItem;var aAttributeItemDefaults;var aConditionalAttributeItems;function ShowConditionalQuestion(lAttributeItemID,sValueSource,bCheckbox)
{var sValue=sValueSource;if(sValueSource.value){sValue=sValueSource.value.split('|')[2];}
var aItems;var aConditionalItems;if(aAttributeItems[lAttributeItemID])
{aItems=aAttributeItems[lAttributeItemID];aConditionalItems=new Array(aItems.length)
for(var i=0;i<aItems.length;i++)
{for(var j=0;j<aItems[i][1].length;j++)
{var checkbox=document.getElementById('q'+aItems[i][1][j]);if((bCheckbox&&checkbox&&checkbox.checked)||aItems[i][1][j]==sValue)
{aConditionalItems[i]=true;}}}
for(var i=0;i<aConditionalItems.length;i++)
{if(aConditionalItems[i])
{ChangeDisplay(aItems[i][0],'','True');}
else
{ChangeDisplay(aItems[i][0],'none','False');}}}}
function ChangeDisplay(sItem,sDisplay,sValue)
{document.getElementById('r_'+sItem).style.display=sDisplay;if(document.getElementById('r_'+sItem+'_error'))
{document.getElementById('r_'+sItem+'_error').style.display=sDisplay}
if(document.getElementById('qDisplay'+sItem))
{document.getElementById('qDisplay'+sItem).value=sValue;}}
function SetupConditionalAttributeItems(lAttributeItemID,lAttributeItemDefaultID,lAttributeItemDefaultCount,lConditionalAttributeItemID)
{aAttributeItem=new Array(2);aAttributeItemDefaults=new Array(lAttributeItemDefaultCount);aAttributeItemDefaults[0]=lAttributeItemDefaultID;aAttributeItem[0]=lAttributeItemID;aAttributeItem[1]=aAttributeItemDefaults;if(typeof aAttributeItems[lConditionalAttributeItemID]=='undefined')
{aConditionalAttributeItems=new Array()}
else
{aConditionalAttributeItems=aAttributeItems[lConditionalAttributeItemID]
lCount=aConditionalAttributeItems.length}
aConditionalAttributeItems[aConditionalAttributeItems.length]=aAttributeItem}

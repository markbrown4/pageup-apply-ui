var bMissingInfo;var bIgnoreMandatoryFieldChecking;bIgnoreMandatoryFieldChecking=false;function ignoreMandatoryFieldChecking(){bIgnoreMandatoryFieldChecking=true;}
function educationSelectionPopup(sID,sCountryDropdownID,clAttributeItemID){var countryID;if(document.getElementById(sCountryDropdownID)){countryID=document.getElementById(sCountryDropdownID).value;}else{countryID="";}
var uniID=document.getElementById(sID).value;var windowWidth=720;var w=window.open('SelectUniDialog.aspx?sDesc='+sID+'Text'+'&lCountryID='+countryID+'&sID='+sID+'&sCountryDropdownID='+sCountryDropdownID+'&lUniID='+uniID,'_blank','width='+windowWidth+',height=500,resizable');w.onload=function(){var body=w.document.body;var windowHeight=(body.clientHeight||body.offsetHeight)+(w.outerHeight-w.innerHeight)+10;w.resizeTo(windowWidth,windowHeight);};return false;}
function checkItemsHaveBeenFilledOut(aMandatoryItems,aFieldTypes,lAttributeItemID,lNo,bHighlightFields)
{var oField;var sItemID;var bMandatoryError=false;var bMinimumError;var oRow;var bChecked;var sFieldType;var customFunctionName;var aSubSelects;var aSubInputs;var sDatePart;var lDay;var lYear;var sMonth;for(j=0;j<aMandatoryItems.length;j++)
{bMissingInfo=false;bChecked=false;sItemID=aMandatoryItems[j]+'_'+lNo;sFieldType=aFieldTypes[j];customFunctionName=aMandatoryItems[j]+'MandatoryCheck';if(sFieldType=="radio")
{oField=document.getElementsByName(sItemID);}
else
{oField=document.getElementById(sItemID);}
oRow=document.getElementById('r_'+sItemID);if(oField!=null&&oField!=''&&oRow.style.display!='none')
{if(eval('typeof('+customFunctionName+')')=='function')
{eval('bMissingInfo = '+customFunctionName+'("'+lAttributeItemID+'","'+sItemID+'", bIgnoreMandatoryFieldChecking)');}
else if(sFieldType=="language")
{aSubSelects=oField.getElementsByClassName('dropdownvalue');for(l=0;l<aSubSelects.length;l++){if(aSubSelects[l].value==""){bMissingInfo=true;}}}
else if(sFieldType=="radio")
{for(k=0;k<oField.length;k++)
{if(oField[k].checked)
{bChecked=true;k=oField.length;}}
if(!bChecked)
{bMissingInfo=true;}}
else if(sFieldType=="multipleselect")
{aSubSelects=oField.getElementsByClassName('dropdownvalue');for(l=0;l<aSubSelects.length;l++){if(aSubSelects[l].value==""){bMissingInfo=true;}}}
else if(sFieldType=="checkboxes")
{bMissingInfo=true;aSubInputs=oField.getElementsByTagName('input');for(l=0;l<aSubInputs.length;l++){if(aSubInputs[l].checked)
{bMissingInfo=false;}}}
else if(sFieldType=="datefield")
{lDay="0";sMonth="";lYear="0";aSubSelects=oField.getElementsByClassName('dropdownvalue');for(l=0;l<aSubSelects.length;l++){if(aSubSelects[l].id.lastIndexOf("_")!=-1)
{sDatePart=aSubSelects[l].id.substring(aSubSelects[l].id.lastIndexOf("_")+1).replace('-postback','');if(aSubSelects[l].value!="")
{if(sDatePart=="day")
{lDay=aSubSelects[l].value;}
else if(sDatePart=="month")
{sMonth=aSubSelects[l].value;}}}}
aSubInputs=oField.getElementsByTagName('input');for(l=0;l<aSubInputs.length;l++){if(aSubInputs[l].id.lastIndexOf("_")!=-1)
{sDatePart=aSubInputs[l].id.substring(aSubInputs[l].id.lastIndexOf("_")+1)
if(sDatePart=="year")
{lYear=aSubInputs[l].value;}}}
bMissingInfo=!validateDateField(lDay,sMonth,lYear);}
else if(oField.type!=null)
{if(oField.value=='')
{bMissingInfo=true;}}
else
{checkForMissingInfo(oField,lAttributeItemID,sItemID);}
if(bMissingInfo)
{bIgnoreMandatoryFieldChecking=false;bMandatoryError=true;}
if(sFieldType=="column")
{oField=$(aMandatoryItems[j]+'_label');}
else
{oField=$(sItemID+'_label');if(oField==null){oField=$(sItemID+'Text_label');}}
if(oField!=null)
{if(bHighlightFields)
{if(bMissingInfo)
{oField.addClassName('fieldError');}
else
{oField.removeClassName('fieldError');}}}}}
return!bMandatoryError;}
function showMessage(sID,bShow,sMessage)
{var oField=document.getElementById(sID);var oTextNode;if(oField)
{if(bShow)
{for(var i=0;i<oField.childNodes.length;i++)
{oField.removeChild(oField.childNodes[i]);}
oTextNode=document.createTextNode(sMessage);oField.style.display='';oField.appendChild(oTextNode)}
else
{oField.style.display='none';}}}
function showMandatoryErrorMessage(bShow)
{showMessage('profileErrorHeader',bShow,'Please fill in all mandatory fields marked with an asterisk (*).');var mandatoryMessage=document.getElementById('mandatory-message');if(bShow&&mandatoryMessage)
mandatoryMessage.style.visibility="hidden";}
function checkForMissingInfo(oField,lAttributeItemID,sItemID)
{var oChildNodes;var k;oChildNodes=oField.childNodes;for(k=0;k<oChildNodes.length;k++)
{if(oChildNodes[k].name!=null&&oChildNodes[k].name.indexOf('q'+lAttributeItemID+'_'+sItemID)>=0)
{if(oChildNodes[k].value=='')
{bMissingInfo=true;}}
if(oChildNodes[k].childNodes.length>0)
{checkForMissingInfo(oChildNodes[k],lAttributeItemID,sItemID);}}}
function validateDateField(plDay,psMonth,plYear)
{var regexYear=new RegExp('^[0-9]{4,4}$','i')
var lMonth=getMonthNumber(psMonth);if(!regexYear.test(plYear))
{plYear='';}
if(plDay>0&&lMonth>0&&regexYear.test(plYear))
{if((plYear%4==0)||(plYear%100==0)||(plYear%400==0))
{if((lMonth==2)&&(plDay>29))
{return false;}}
else if((lMonth==2)&&(plDay>28))
{return false;}
else if((plDay>30)&&((lMonth=='4')||(lMonth=='6')||(lMonth=='9')||(lMonth=='11')))
{return false;}
else if(plDay>31)
{return false;}}
else if(plDay==0||lMonth==0||plYear=='')
{return false;}
return true;}
function getMonthNumber(psMonth)
{var lMonth=0;switch(psMonth.toLowerCase())
{case"jan":lMonth=1;break;case"feb":lMonth=2;break;case"mar":lMonth=3;break;case"apr":lMonth=4;break;case"may":lMonth=5;break;case"jun":lMonth=6;break;case"jul":lMonth=7;break;case"aug":lMonth=8;break;case"sep":lMonth=9;break;case"oct":lMonth=10;break;case"nov":lMonth=11;break;case"dec":lMonth=12;break;}
return lMonth;}

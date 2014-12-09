function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++)
        {
         hash = hashes[i].split('=');
         vars.push(hash[0]);
         vars[hash[0]] = hash[1];
         }

     return vars;
}

function selectElement(valueToSelect)
{    
    var element = document.getElementById('Field10');
    element.value = valueToSelect;
}

var get = getUrlVars();

if (get['intent'] == 'hire'){
	selectElement("Hire me");
} else if (get['intent'] == 'samples') {
	selectElement("See some work samples");
}

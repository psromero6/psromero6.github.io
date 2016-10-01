

function handleFileSelect(evt) {
	var f = evt.target.files[0]; // File object only one available

	var reader = new FileReader();
	var boxVert=[];
	var	boxIndices=[];
	reader.onload = function (progressEvent) {

		var lines = this.result.split('\n');
		for (var line = 0; line < lines.length; line++) {
			var pline = lines[line].split(' ');
			if (pline[0] == 'v') {
				boxVert.push(pline[1]);
				boxVert.push(pline[2]);
				boxVert.push(pline[3]);
			}
			else if(pline[0] == 'f'){
				boxIndices.push(pline[1]-1);
				boxIndices.push(pline[2]-1);
				boxIndices.push(pline[3]-1);
			}
		}
		replaceObject(boxVert,boxIndices);
	};
	reader.readAsText(f);
}

document.getElementById('objfile').addEventListener('change', handleFileSelect, false);

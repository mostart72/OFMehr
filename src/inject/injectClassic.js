var color;
var red = "#FF3300";
var orange = "#F4A742";
var blue = "#4286F4";

chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			// ----------------------------------------------------------

			chrome.storage.local.get({                                                           
				stufenClassicDE: ''                                                               
			  }, function(items) {                                                                
					var stufenTmpArr = items.stufenClassicDE.split("\n");
					var stufen = [];

					stufenTmpArr.forEach(function(entry) {
						var points = entry.split("\t")[1];
						points = points.replace(".","");
						stufen.push(points);
					});

					var stufenSorted = stufen.sort(function(a, b){return a-b});;
					var path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

					console.log("PAGE:"+path);

					if(path == "transfermarkt.php") {
						processTransferPage(stufenSorted);	
					}
					else if(path == "players-statistics.php"){
						processPlayerStatsPage(stufenSorted);
					}
			});   

		}
	}, 10);

	var processTransferPage = function(stufen){
		
			var table = $('div#transfermarkt > div > div > table > tbody');

			table.find('td[width="110"]').each(function() {

				currentStrength = parseInt( $(this).prev('td').text() );
				points = $(this).text().split("/");

				ep = parseInt( points[0].trim().replace(".", "") );
				tp = parseInt( points[1].trim().replace(".", "") );
				awp = calculateAWP(ep,tp);

				diffToNextStep = getDiffToNext(stufen, awp, currentStrength);

				color = blue;	
				if(diffToNextStep < 50) {
					color = red;
				}
				else if(diffToNextStep < 150){
					color = orange;
				}
				
				
				$(this).html($(this).text() + ' ' + '<span style="color:' + color + '">' + diffToNextStep + '</span>');
			});
		}

	var processPlayerStatsPage = function(stufen) {
			var table = $('table#playersStatisticsTable > tbody');

			table.find('tr').each(function() {

				var row = $(this);

				currentStrength = parseInt( row.find("td[title^=St]").text().trim() );

                awp = parseInt( row.find("td[title$=Aufwertung] > span").text().trim().replace(".", "")  );

                diffToNextStep = getDiffToNext(stufen, awp, currentStrength);

                color = blue;
                if(diffToNextStep < 50) {
                    color = red;
                }
                else if(diffToNextStep < 150){
                    color = orange;
                }

               row.find("td[title$=Aufwertung]").next('td').html('<span style="color:' + color + '">' + diffToNextStep + '</span>');
            });
	}


	var getDiffToNext = function(stufen, awp, currentStrength){
		var step = stufen[currentStrength];
		return step - awp;
	}


	var calculateAWP = function(ep,tp){
		var awp = (ep*tp*2) / (ep+tp);
		return awp.toFixed(0);
	};

});

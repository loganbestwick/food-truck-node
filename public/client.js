$(document).ready( function(){

	var markersArray = [];
	var infoWindows = [];
	var openInfoWindow = [];

	function initialize() {
		var mapOptions = {
			zoom: 13,
			center: new google.maps.LatLng(37.772609, -122.442457)
		};

		var map = new google.maps.Map($("#map-canvas")[0], mapOptions);


		$("#search_button").on('click', function(e){
			e.preventDefault();
			var address = $('#truck_search_address').val();
			var radius = $("input:radio:checked").val();
			$.ajax({
				url: "/trucks/new",
				type: "get",
				data: {"search_address" : address, "radius" : radius},
				dataType: 'json'
			}).done(function(data){
				if (data.length < 1){
					alert("There were no food trucks found around that address. Please search at a new address or increase the search radius.");
					return;
				}
				addMarker(data);
				var newCenter = new google.maps.LatLng(parseFloat(data[0]["latitude"]), parseFloat(data[0]["longitude"]));
				map.panTo(newCenter);
			})
		});

		function addMarker(json) {
			if (markersArray.length > 0){
				removeMarkers();
			}
			for(i = 0; i < json.length; i++) {
				var latLng = new google.maps.LatLng(json[i]["latitude"], json[i]["longitude"]);
				var marker = new google.maps.Marker({
					position: latLng,
					map: map,
					title: json[i]["applicant"],
					infoWindowIndex : i
				});

				var content = "<h2>" + json[i]["applicant"] + "</h2>" + "<h4>" + json[i]["address"] + "</h4>" + "<div>" + json[i]["fooditems"] + "</div>";
				var infoWindow = new google.maps.InfoWindow({
					content: content
				});
				google.maps.event.addListener(marker, 'click', function(e){
					if (openInfoWindow.length > 0) {
						openInfoWindow[0].close();
						openInfoWindow = [];
					}
					map.panTo(e.latLng);
					map.setZoom(14);
					infoWindows[this.infoWindowIndex].open(map, this);
					openInfoWindow.push(infoWindows[this.infoWindowIndex])
				});

				infoWindows.push(infoWindow);
				markersArray.push(marker);
			}
		}

		function removeMarkers(){
			for (var i = 0; i < markersArray.length; i++){
				markersArray[i].setMap(null);
			}
			markersArray.length = 0;
		}

	}

	google.maps.event.addDomListener(window, 'load', initialize);

})
$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false)
});

function onDeviceReady(){

	// Check LocalStorage for channel
	if(localStorage.channel == null || localStorage.channel == ''){
		// Ask User for Channel
		$('#popupDialog').popup();
		$('#popupDialog').popup("open");
	} else {
		var channel = localStorage.getItem('channel');
	}

	//var channel = 'yaman911';
	//var channel = 'TechGuyWeb';

	getPlayList(channel);

	$(document).on('click', '#vidlist li', function(){
		showVideo($(this).attr('videoId'));
	});

	$('#channelBtnOK').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlayList(channel);
	});

	$('#saveOptions').click(function(){
		saveOptions();
	});

	$('#clearChannel').click(function(){
		clearChannel();
	});

	$(document).on('pageinit', '#options', function(e){
		var channel = localStorage.getItem('channel');
		var maxResults = localStorage.getItem('maxResults');
		$('#channelNameOptions').attr('value', channel);
		$('#maxResultsOptions').attr('value', maxResults);
	});
	
}

function getPlayList(channel){
	$('#vidlist').html('');
	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyC3KkP4-QlSq3o50CgnciVwJoQPr8GqKzI'
			},
			function(data){				
				$.each(data.items, function(i, item){
					//console.log(item);
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId, localStorage.getItem('maxResults'));
				});
			}
		);
}

function getVideos(playlistId, maxResults){
	$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems",
			 {
			 	part: 'snippet',
			 	maxResults: maxResults,
			 	playlistId: playlistId,
			 	key: 'AIzaSyC3KkP4-QlSq3o50CgnciVwJoQPr8GqKzI'
			 },
			 function(data){
			 	//console.log(data);
			 	var output;
			 	$.each(data.items, function(i, item){
					id = item.snippet.resourceId.videoId;
					title = item.snippet.title;
					thumb = item.snippet.thumbnails.default.url;
					$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
					$('#vidlist').listview('refresh');
				});
			 }
		);
}

function showVideo(id){
	console.log('Showing video '+id);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showVideo').html(output);
}

function setChannel(channel){
	localStorage.setItem('channel', channel);
	console.log('Channel Set: ' + channel);
}

function setMaxResults(maxResults){
	localStorage.setItem('maxResults', maxResults);
	console.log('Max Results Changed: ' + maxResults);
}

function saveOptions(){
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResults = $('#maxResultsOptions').val();
	setMaxResults(maxResults);
	$('body').pagecontainer('change', '#main', {options});
	getPlayList(channel);
}

function clearChannel(){
	localStorage.removeItem('channel');
	$('body').pagecontainer('change', '#main', {options});
	// Clear List Video
	$('#vidlist').html('');
	// Show Popup
	$('#popupDialog').popup('open');
	$('#channelName').val('');
}
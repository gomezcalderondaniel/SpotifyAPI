const app = {};
var capturedPhoto;




app.getArists = (artist) => $.ajax({
	url: 'https://api.spotify.com/v1/search',
	method: 'GET',
	dataType: 'json',
	data: {
		type: 'artist',
		q: artist
	}
});

app.getAristsAlbums = (id) => $.ajax({
	url: `https://api.spotify.com/v1/artists/${id}/albums`,
	method: 'GET',
	dataType: 'json',
	data: {
		album_type: 'album',
	}
});

app.getAlbumTracks = (id) => $.ajax({
	url: `https://api.spotify.com/v1/albums/${id}/tracks`,
	method: 'GET',
	dataType: 'json'
});

app.getAlbums = function(artists) {
	let albums = artists.map(artist => app.getAristsAlbums(artist.id));
	$.when(...albums)
		.then((...albums) => {
			let albumIds = albums
				.map(a => a[0].items)
				.reduce((prev,curr) => [...prev,...curr] ,[])
				.map(album => app.getAlbumTracks(album.id));

			app.getTracks(albumIds);
		});
};

app.getTracks = function(tracks) {
	$.when(...tracks)
		.then((...tracks) => {
			tracks = tracks
				.map(getDataObject)
				.reduce((prev,curr) => [...prev,...curr],[]);	
			const randomPlayList = getRandomTracks(50,tracks);
			app.createPlayList(randomPlayList);
		})
};

app.createPlayList = function(songs) {
	const baseUrl = 'https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:';
	songs = songs.map(song => song.id).join(',');
	$('.loader').removeClass('show');
	$('.playlist').append(`<iframe src="${baseUrl + songs}" height="400"></iframe>`);
}

app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		let artists = $('input[type=search]').val();
		$('.loader').addClass('show');
		artists = artists
			.split(',')
			.map(app.getArists);
		
		$.when(...artists)
			.then((...artists) => {
				artists = artists.map(a => a[0].artists.items[0]);
				console.log(artists);
				app.getAlbums(artists);
            });
            
            var clientId = '1182c78c1d1640bdb11753b2a466f09b';
            var clientSecret = '0f902fbad3ed4cacbf15cc4d9697964c';
            var moodSelect = $("input[type=search]").val().toLowerCase();
            var token = 'BQDMWbsGwsQWKGt-0nLdAu9wSpfHlg0bNKZvbD2jhkchrt2ZwT3-tONbGpKXkDtEUDsY6Iq-KNPUbe6-E3VvcVu05XEd6C-_I5SA7Q3c8qwJydoqSo8P7FNSMVMObDSZdC1GxJ4K_qwaxBDA5IgyA1j7Sw';
            var queryURL = 'https://api.spotify.com/v1/search?type=playlist&q=' + moodSelect + '&access_token=' + token;       
            
            
            $.ajax({
                url: queryURL,
                method:'GET'
            }).then(function(response){
                console.log("mood:" + moodSelect);
                console.log(response);
                var embedCode = '<iframe  src="https://open.spotify.com/embed/playlist/' + response.playlists.items[0].id + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media" class="z-depth-5"></iframe>';
                $('.playlist').html(embedCode);
          })

	});

}

const getDataObject = arr => arr[0].items;

function getRandomTracks(num, tracks) {
	const randomResults = [];
	for(let i = 0; i < num; i++) {
		randomResults.push(tracks[ Math.floor(Math.random() * tracks.length) ])
	}
	return randomResults;
}

$(app.init);



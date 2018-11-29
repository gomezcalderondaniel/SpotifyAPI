const app = {};

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
            var clientSecret = 'cb0c0bcae4fb45dead4532baaa701f27';
            var moodSelect = $("input[type=search]").val().toLowerCase();
            var queryURL = 'https://api.spotify.com/v1/search?type=playlist&q=' + moodSelect + '&access_token=BQASm5WP_5Hb9umlpgRk5FKPgi7msmFSqGLM4b8x94tlupAnp4ricYMLSkCxFosH9Bmr8Lm-BPXNl41s9QVIZI5GKpioeA2rLHDKx7RmBlOTWhqiOW1dA0rkaGHl3TS42eRrUVBR43ykPA5eZ9IobgeokQ';
        
            
            
            $.ajax({
                url: queryURL,
                method:'GET'
            }).then(function(response){
                console.log("mood:" + moodSelect);
                console.log(response);
                var embedCode = '<iframe src="https://open.spotify.com/embed/playlist/' + response.playlists.items[0].id + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
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





// $('.form').on('submit', function(event) {
//     event.preventDefault();

    

//     var clientId = '7f7d8a472a82495cb135227ad7a595a1';
//     var clientSecret = '23aba3d8f521463998673ac3ffbcb01c';
//     var moodSelect = $("#channel-input").val().toLowerCase();
//     var queryURL = 'https://api.spotify.com/v1/search?type=playlist&q=' + moodSelect + '&access_token=BQC2FS3HzkXjfzlWIunPeP00WkMxJujnhymqRL0RfQYvjNFaqEDQjJe8yoJzqLvcNYj9xULBH-NGupWZam1xF3NOA6F8M0KrUS91VpOMEvnM8d1QLDA1o6Y6zlcAMi7-44JgtGQ7djp-wUzzldbyWPKQ';

    
    
//     $.ajax({
//         url: queryURL,
//         method:'GET'
//     }).then(function(response){
//         console.log("mood:" + moodSelect);
//         console.log(response);
//         var embedCode = '<iframe src="https://open.spotify.com/embed/playlist/' + response.playlists.items[0].id + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
//         $('.playlist').html(embedCode);
//   })
    
// })

// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBq9g0wIZE9mw5II9BXZEouUvuKGOWbIK8",
//     authDomain: "moodlist-6736e.firebaseapp.com",
//     databaseURL: "https://moodlist-6736e.firebaseio.com",
//     projectId: "moodlist-6736e",
//     storageBucket: "moodlist-6736e.appspot.com",
//     messagingSenderId: "224635158925"
//   };
//   firebase.initializeApp(config);
//   var database = firebase.database();


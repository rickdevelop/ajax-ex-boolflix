var supportedCountries = ['it', 'en','es'];

$(document).ready(function () {

  var apiParameters = {
    urlBase: 'https://api.themoviedb.org/3/search/multi',
    data: {
      api_key: 'b72963587efc03acbd1bf6e9e6dc5428',
      query: '',
    },
  };

  $('#sourceButton').click(function () {

    if ($('#inputSearch').val() != '') {

      apiParameters.data.query = $('#inputSearch').val();

      $.ajax({
        url: apiParameters.urlBase,
        method: 'GET',
        data: apiParameters.data,
        success: function (apiData) {
          $('#inputSearch').val('');
          console.log('Hai cercato risultati per: ' + apiParameters.data.query);
          console.log(apiData.results);

          $('.contenuti .card_content').remove();

          mostraFilmESerieTVda(apiData);

        },
        error: function (error) {
          console.log('Error retrieving data');
        },
      });
    }
  });

});
function mostraFilmESerieTVda(apiData) {
  function isMovie(mediaType) {
    return mediaType == 'movie';
  }

  function hasCover(content) {
    return (content.backdrop_path != null || content.poster_path != null );
  }

  for (var i = 0; i < apiData.results.length; i++) {

    var tipoContenuto = apiData.results[i].media_type;

    if (tipoContenuto == 'movie' || tipoContenuto == 'tv') {

      var contenuto = apiData.results[i];

      var voto = convertiInScalaDa1a5(contenuto.vote_average);
      console.log(voto);

      var htmlTemplateContenuto = $('#contentScript').html();
      var template = Handlebars.compile(htmlTemplateContenuto);

      var data = {
        titolo: (isMovie(tipoContenuto)) ? contenuto.title : contenuto.name,
        titoloOriginale: (isMovie(tipoContenuto)) ? contenuto.original_title : contenuto.original_name,
        lingua: gestisciLingua(contenuto.original_language),
        votazione: (voto != 'nd') ? gestisci(voto, contenuto) : 'nd',
        tipologiaContenuto: tipoContenuto,
        copertina : (hasCover(contenuto)) ? gestisciCopertinaPer(contenuto) : "<img class='copertina overlay' src='image-not-found.png' />'",
        trama: contenuto.overview,
      };

      var htmlResult = template(data);

      $('.content').append(htmlResult);
    }

  }
}

function gestisciLingua(language) {
    var htmlOutput = '';

    if (supportedCountries.includes(language)) {
      console.log(language + ' lingua supportata');
      htmlOutput = "<img class='bandiera' src='" + language + ".png' />";
    } else {
      htmlOutput = language + ' non supportata';
    }

    return htmlOutput;

}

function gestisci(vote, content) {

  var tagVote = '';

  for (var i = 1; i <= 5; i++) {
    tagVote += (i <= vote) ? "<i class='fas fa-star'></i>" : "<i class='far fa-star'></i>";
  }

  return tagVote;
}

function gestisciCopertinaPer(content) {

  var path = (content.backdrop_path != null) ? content.backdrop_path : content.poster_path;
  var size = (content.backdrop_path != null) ? 'w300' : 'w342';
  var coverUrl = 'https://image.tmdb.org/t/p/' + size + path;

  return "<img class='copertina overlay' src='" + coverUrl + "' />'";
}
function convertiInScalaDa1a5(vote) {
  return (vote != 0) ? Math.ceil(vote / 2) : 'nd';
}

var currentGame = {};
var showForm = false;
var editingGame;


$(document).ready( function() {
  $(document).on('click', '.game-item', function() {
    currentGame.id = this.dataset.id
    currentGame.name = this.dataset.name
    $.ajax({
      url: '/games/' + currentGame.id + '/characters',
      method: 'GET',
      dataType: 'JSON'
    }).done( function(characters) {
      $('#game').text('Characters in ' + currentGame.name)
      var list = $('#characters');
      list.empty();
      characters.forEach( function(char) {
        var li = '<li data-character-id="' + char.id + '">' + char.name + '-' + char.power + '</li>'
        list.append(li)
      });
    });
  });

  $('#toggle').on('click', function() {
    showForm = !showForm;
    $('#game-form').remove()
    $('#games-list').toggle()

    if (showForm) {

      $.ajax({
        url: '/game_form',
        method: 'GET'
      }).done( function(html) {
        $('#toggle').after(html);
      });
    }
  });

  $(document).on('submit', '#game-form form', function(e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    $.ajax({
      url: '/games',
      type: 'POST',
      dataType: 'JSON',
      data: data
    }).done( function(game) {
      toggle();
      getGame(game.id);
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    });
  });

  function getGame(id) {
    $.ajax({
      url: '/games/' + id,
      method: 'GET'
    }).done( function(game) {
      $('#games-list').append(game);
    });
  }

  $(document).on('click', '#edit-game', function() {
    toggle();
  });
});

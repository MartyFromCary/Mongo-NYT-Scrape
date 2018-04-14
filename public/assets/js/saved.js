$(document).ready(function() {
    const root = $("#root");
  
    const noteModal = {
      root: $("#noteRoot"),
      title: $("#noteTitle"),
      body: $("#noteBody"),
      area: $("#noteArea"),
      submit: $("#noteSubmit")
    };
  
    function createNote(_id) {
      const insNote = {
        title: noteModal.title.val().trim(),
        body: noteModal.body.val().trim(),
        _id
      };
  
      if (insNote.title && insNote.body) {
        $.ajax({
          method: "POST",
          url: "/createNote",
          data: insNote
        }).then(note => {
          appendNote(note, insNote._id);
          noteModal.title.val("");
          noteModal.body.val("");
        });
      }
    }
  
    function appendNote(note, _id) {
      noteModal.area.append(
        `<div class="note" data-note-id=${note._id} data-article-id=${_id}>
              <button class="deleteNote">X</button>
        <p class="noteTitle">${note.title}</p>
      </div>`
      );
    }
  
    $(document).on("click", ".addNote", function() {
      const _id = $(this).data("id");
  
      noteModal.title.val("");
      noteModal.body.val("");
      noteModal.body.attr("data-id", _id);
      noteModal.submit.attr("data-id", _id);
  
      $.ajax({
        method: "GET",
        url: "notes/" + _id
      }).then(({ notes }) => {
        noteModal.area.empty();
        notes.forEach(note => appendNote(note, _id));
        noteModal.root.modal("show");
      });
    });
  
    noteModal.submit.on("click", function(e) {
      e.preventDefault();
      createNote($(this).attr("data-id"));
    });
  
    $(document).on("click", ".deleteArticle", function(e) {
      e.preventDefault();
      $.ajax({
        method: "DELETE",
        url: "/deleteArticle",
        data: { _id: $(this).data("id") }
      }).then(response => {
        window.location.href = "/viewSaved";
      });
    });
  
    $(document).on("click", ".deleteNote", function(e) {
      e.stopPropagation();
      const noteDiv = $(this).parent();
  
      $.ajax({
        method: "DELETE",
        url: "/deleteNote",
        data: { _id: noteDiv.data("note-id") }
      }).then(() => noteDiv.remove());
    });
  
    $(document).on("click", ".note", function(e) {
      e.stopPropagation();
  
      $.ajax({
        method: "GET",
        url: "/note/" + $(this).data("note-id")
      }).then(note => {
        noteModal.title.val(note.title);
        noteModal.body.val(note.body);
      });
    });
  
    $.getJSON("/saved", articles =>
      articles.forEach(({ _id, storyUrl, headline, imgUrl, summary, byLine }) =>
        root.append(`
              <div class="panel panel-success">
                <div class="panel-heading">
                  <a href="${storyUrl}" target="_blank"><h2>${headline}</h2></a>
                </div>
                <div class="panel-body">
                  <div class="pull-right"><img src="${imgUrl}" alt="" height="150"></div>
                  <h2>${summary}</h2>
                </div>
                <div class="panel-footer">${byLine}</div>  
                <button class="addNote" data-id="${_id}">Add Note</button>
                <button class="deleteArticle" data-id="${_id}">Delete Article</button>
              </div>`)
      )
    );
  });
  
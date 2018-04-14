$(document).ready(function() {
  const root = $("#root");

  $("#alertModal").on("hide.bs.modal", function(e) {
    window.location.href = "/";
  });

  $("#scrape").on("click", function(e) {
    e.preventDefault();
    $.ajax({
      url: "/scrape",
      type: "GET",
      success: response => $("#numArticles").text(response.count),
      complete: result => $("#alertModal").modal("show")
    });
  });

  $(document).on("click", "#saveArticle", function() {
    $.ajax({
      method: "POST",
      url: "/saveArticle",
      data: { _id: $(this).data("id") }
    }).then(response => {
      window.location.href = "/";
    });
  });

  $.getJSON("/notsaved", articles =>
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
              <button id="saveArticle" data-id="${_id}">Save</button>
            </div>`)
    )
  );
});

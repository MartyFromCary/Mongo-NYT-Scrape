$(() => {
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
});

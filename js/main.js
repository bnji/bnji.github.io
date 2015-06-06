$(function() {
  $.getJSON('data/projects.json', function(data) {
    $.each(data, function(key, val) {
      Bendot.clone(key, val);
    });
    //console.log(data);
  }).done(function() {
    $('.header').parallax("50%", 0.3);
    $('.callout').parallax("50%", 0.3);
    $('#geo-location').parallax("50%", 0.01);
  });

  /*$('#menu-toggle').waypoint(function(direction) {
    $("#sidebar-wrapper").removeClass("active");
  });
  $('#intro').waypoint(function(direction) {
    //alert('Top of thing hit top of viewport.');
    $("#sidebar-wrapper").toggleClass("active");
  });
  $("#menu-close").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });*/

  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
        || location.hostname == this.hostname) {

      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });


  $('body').scrollspy({ target: '#sidebar', offset:0 });


  $('body').scrollspy({ target: '#sidebar-wrapper', offset:0 });

  $('body').on('activate.bs.scrollspy', function () {
    console.log('scrolling...');
   // if(!clicked)$('#sidebar-wrapper > ul > h2').css('padding-top',0);
    //clicked = false;
  });



});

var Bendot = {
  clone : function(key, val) {
    var obj = $('#project-template').ModelView({
      title: val['title'],
      description: val['description'],
      tags: val['tags']
      // location: val['location']
    }, {
        controller: MVC.Controller({ }),
        clone: {
            //id: "#" + $.now(),
            withDataAndEvents: true,
            append: function(elem) {
                $('#projects-body').append(elem);
                $(elem).show();
            }
        }
    });
    //obj.Set('description', 'foobar');
    // console.log(obj['title']);
    // console.log(obj.Get('description'));
    $(obj.GetViewId() + " #title").html(obj.Get('title'));
    $(obj.GetViewId() + " #description").html(obj.Get('description'));
    $(obj.GetViewId() + " #tags").html(obj.Get('tags'));
    $(obj.GetViewId() + " a").attr('href', obj.Get('location')).text(obj.Get('location'));

    $.each(val['images'], function(key2, val2) {
      var img = $('<img />').addClass('img-projects').addClass('img-responsive').attr('src', 'img/projects/' + val2);
      $(obj.GetViewId() + " .projects-item").append(img).append("<br />");
    });

    $.each(val['location'], function(key3, val3) {
      var loc = $('<a />').attr('href', val3).text(val3);
      $(obj.GetViewId() + " .project-locations").append(loc).append("<br /><br />");
    });
  }
}
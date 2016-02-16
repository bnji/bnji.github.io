var objects = [];
var projects = [];
var tags = [];

$(function() {

  // function addScroll(name) {
  //   var followScroll = $(name),
  //     originalY = followScroll.offset().top;
  //   // Space between element and top of screen (when scrolling)
  //   var topMargin = 20;
  //   $(window).on('scroll', function(event) {
  //       var scrollTop = $(window).scrollTop();
  //       // console.log(scrollTop + " - " + followScroll.offset().top);
  //       followScroll.stop(false, false).animate({
  //           top: scrollTop < originalY
  //                   ? 0
  //                   : scrollTop - originalY + topMargin
  //       }, 30);
  //   });
  // }

  // addScroll('.follow-scroll-1');
  //
  $('.follow-scroll').each(function() {
    // $(this).affix({
    //     offset: {
    //         top: function(e) {
    //             var $curSection = $(e).closest('.row');
    //             return (this.top = $curSection.offset().top - 10);
    //         },
    //         bottom: function (e) {
    //             var $nextSection = $(e).closest('section').next('section');
    //             //if last element, go to bottom of page
    //             var bottom = ($nextSection.length === 0) ? 0 :
    //                          $(document).height() - $nextSection.offset().top;
    //             return (this.bottom = bottom);
    //         }
    //     }
    // });
  });



  $(document).on('click', '.filter', function() {
    $('.filter').removeClass('btn-primary').addClass('btn-link');
    $(this).removeClass('btn-link').addClass('btn-primary');
    Bendot.show($(this).text());
  });

  // $("#load-first-project-waypoint").waypoint(function(direction) {
  //   Bendot.clone(0);
  // });

  $.getJSON('data/projects.json', function(data) {
    projects = data;
    $.each(data, function(key, val) {
      Bendot.clone(key);
    });
    // console.log(tags);
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
  show : function(keyword) {
    $.each(objects, function(k, v) {
      var tags = v.Get('tags').trim().toLowerCase().split(', ');//.split(/[\s,]+/);
      v.Hide();
      if(keyword.toLowerCase() === "all" || _.contains(tags, keyword.toLowerCase())) {
        v.Show();
      }
    });
  },
  clone : function(key) {
    if(key >= projects.length) return;
    var val = projects[key];
    var obj = $('#project-template').ModelView({
      canClone: true,
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
                // $(elem).fadeIn('fast', function() {
                //   $(this).waypoint(function(direction) {
                //     if(obj.canClone && key < projects.length) {
                //       console.log(key + " / " + projects.length);
                //       key++;
                //       setTimeout(function() {
                //         Bendot.clone(key);
                //       }, 100);
                //     }
                //     obj.canClone = false;
                //   });
                // });
            }
        }
    }, {
      Hide : function () {
        $(obj.GetViewId()).fadeOut('fast');
      },
      Show : function () {
        $(obj.GetViewId()).fadeIn('fast');
      }
    });
    //obj.Set('description', 'test');
    // console.log(obj['title']);
    // console.log(obj.Get('description'));
    var viewId = obj.GetViewId();
    $(viewId + " #title").html(obj.Get('title'));
    $(viewId + " .description").html(obj.Get('description'));
    $(viewId + " #tags").html("Tags: <b>" + obj.Get('tags') + "</b>");
    $(viewId + " a").attr('href', obj.Get('location')).text(obj.Get('location'));

    var objTags = obj.Get('tags').trim().split(', ');
    // console.log(objTags);
    $.each(objTags, function(k,v) {
      if(!_.contains(tags, v)){
        tags.push(v);
        $("<button />").addClass("filter btn btn-lg btn-link").text(v).appendTo('#project-tags');
      }
    });

    $.each(val['images'], function(k, imageName) {
      var imgHref = 'img/projects/' + imageName;
      var lnk = $('<a />').attr('data-fancybox-group', 'gallery-' + viewId).addClass('fancybox').attr('href', imgHref);
      var img = $('<img />').addClass('img-projects').addClass('img-responsive').attr('src', imgHref);
      lnk.append(img);
      $(viewId + " .projects-item").append(lnk).append("<br />");
    });

    $.each(val['location'], function(key3, val3) {
      var loc = $('<a />').attr('href', val3).text(val3);
      $(viewId + " .project-locations").append(loc).append("<br /><br />");
    });
    objects.push(obj);
  }
}
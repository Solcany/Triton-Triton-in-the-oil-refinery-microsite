const triggerOffsetRatio = 0.5;
const springEffect = 0.8;

window.onload = function() {
	var container = document.getElementsByClassName('timeline-container');
	var layers = document.getElementsByClassName('layer');
	var timeline = new HorizontalScroll.default({
		layers : layers,
		container: container,
		springEffect: springEffect,
		triggerOffsetRatio: triggerOffsetRatio
	});
    timeline.destroy();

	 $(window).keypress(function(e) {
      if(e.keyCode == 13) {
		$('body').css('overflow-y', 'scroll');
		timeline.destroy();
	    console.log("restoring vertical scroll");
      }})

     restoreTimeline_whenElreachesViewport(timeline, '.tl', -13);
}

var restoreTimeline_whenElreachesViewport = function(timeline, el, CUSTOM_OFFSET = null) {
	let $el = $(el);
	let el_offset_top;

	if(CUSTOM_OFFSET != null) {
		el_offset_top = $el.offset().top + CUSTOM_OFFSET;
	} else {
		el_offset_top = $el.offset().top;
	}

	let scrolledPX = 0;
	let isRestored = false;
 	let position = $(window).scrollTop();

	$(window).scroll(_.debounce(function() {
            scrolledPX = parseInt($(window).scrollTop());
	     if(scrolledPX >= el_offset_top-1 && scrolledPX <= el_offset_top+10) {
	    	// lock vertical scrolling by hiding overflow
	    	$('body').css('overflow-y', 'hidden');
	    	// restore timeline horizontal scrolling
	    	isRestored = true;
	    	timeline._triggerStaticCell(timeline.cells[0])

	    	timeline.restore();
	     }
		window.onwheel = function(event)  {
			let timelineCurrentScroll = Math.round(timeline.vars.scrollValue);
		    let delta = Math.sign(event.deltaY);
		    if(delta < 0 & isRestored && timelineCurrentScroll <= 0) {
		     	console.log("unblock-scroll-up");
		     	$('body').css('overflow-y', 'scroll');
		    	timeline.destroy();
		    	timeline._untriggerStaticCell(timeline.cells[0])

		    	isRestored = false;
		    }
	     	showFixedElement_whenTimelineEnds('#dataviz', timeline, 0.8, 0.9);
	     	updateProgressBar("#reading_progress", timeline);
	 	}
    }, 0));
}

var showFixedElement_whenTimelineEnds = function(element, timeline, start, end) {
	$el = $(element);

	let window_width = $(window).width();
	let timeline_width = timeline.vars.totalTimelineWidth;
	let start_ = timeline_width * start;
	let end_ = timeline_width * end;

	let timelineCurrentScroll = Math.round(timeline.vars.scrollValue) + window_width;
	let difference = timeline_width - timelineCurrentScroll

	if(timelineCurrentScroll >= start_) {
		let opacity = rerange(timelineCurrentScroll, start_, end_, 0.0, 1.0);
		$el.css({"opacity": opacity});
		if(opacity > 0.95) {
			$el.css({"pointer-events": "visible"});
		} else {
			$el.css({"pointer-events": "none"});
		}
	} else {
		$el.css({"opacity": 0});
	}
}

var updateProgressBar = function(progressBar, timeline) {
	$progressBar = $(progressBar);

	let window_width = $(window).width();
	let timeline_width = timeline.vars.totalTimelineWidth;
	let timelineCurrentScroll = Math.round(timeline.vars.scrollValue);

	let width = rerange(timelineCurrentScroll, 0, timeline_width - window_width, 0, window_width);
	$progressBar.css({"width": width + "px"});
}

var rerange = function(n, start1, stop1, start2, stop2, withinBounds) {
	// p5js func
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
};

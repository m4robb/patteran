var masterFunctions = function() {

	var videoDuration = 0, playHeadPos = 0, playSpeed = 0, delta = -1, autoScrollOff, scrollTimeout, timer = 0

	var master = this

	master.percent = 0

	var canvas = document.getElementById('video-canvas');
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');

	ctx.globalAlpha = .1
	//context.globalCompositeOperation = 'destination-out';

	var loadVideo = function(videoURL) {

		$("#main-screen")[0].src = videoURL

		$("#main-screen")[0].load()

		$("#main-screen")[0].oncanplaythrough = function(){
			videoDuration = $("#main-screen")[0].duration
			playSpeed = 1/(videoDuration*60) // in frames!		
		}

	}


	var setEvents = function(){



   		$("#scroll-wrapper")[0].addEventListener("touchstart", touchStart, false);
		$("#scroll-wrapper")[0].addEventListener("touchend", touchEnd, false);
		//$("#scroll-wrapper")[0].addEventListener("touchcancel", touchCancel, false);
		$("#scroll-wrapper")[0].addEventListener("touchleave", touchEnd, false);
		$("#scroll-wrapper")[0].addEventListener("touchmove", touchMove, false);

    	$("#scroll-wrapper")[0].addEventListener("mousewheel", scrollHandler, false); // IE9, Chrome, Safari, Opera
    	$("#scroll-wrapper")[0].addEventListener("DOMMouseScroll", scrollHandler, false); // Firefox


		function touchStart(e){
			e.preventDefault();
			console.log('start touch')
			var touches = e.changedTouches;
			for (var i=0; i < touches.length; i++) {
				console.log(touches[i].pageY)
			}
		}

		function touchEnd(e){
			e.preventDefault();
			var touches = e.changedTouches;
			for (var i=0; i < touches.length; i++) {
				console.log(touches[i].pageY)
			}
		}

		function touchMove(e){
			e.preventDefault();
			var touches = e.changedTouches;
			for (var i=0; i < touches.length; i++) {
				console.log(touches[i].pageY)
			}
		}

		function scrollHandler(e){

			e.preventDefault();

	        delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); // -1 for down, 1 for up

	        master.percent -= (playSpeed*5) * delta

	        scrollFunction()

			clearTimeout(scrollTimeout)

			autoScrollOff = true
			
			scrollTimeout = null

	        scrollTimeout = setTimeout(function(){
	        	console.log('start auto')
	        	autoScrollOff = false
	        },100)

		}		
	}


	var scrollFunction = function(){

		if(master.percent <= 0) master.percent = 0.01
		else if(master.percent > 1) master.percent = 1

		$("#main-screen")[0].currentTime = videoDuration * master.percent

        //ctx.globalCompositeOperation = 'source-over'

		ctx.drawImage($("#main-screen")[0],0,0,window.innerWidth,window.innerHeight);

	}


	var frameRunner = function() {

		//console.log($("#main-screen")[0].currentTime)

		requestAnimationFrame(frameRunner)

		if (!autoScrollOff) {

			if(master.percent <= 0) master.percent = 0.01
				else if(master.percent > 1) master.percent = 1

			master.percent -= (playSpeed*.05) * delta	

			$("#main-screen")[0].currentTime = videoDuration * master.percent

			ctx.drawImage($("#main-screen")[0],0,0,window.innerWidth,window.innerHeight);	

		}

			
	}	

	this.init = function(){
		setEvents()
		frameRunner()	
	}

}


$(document).ready(function(){
	var master = new masterFunctions();
    master.init();
});



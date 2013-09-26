

var masterFunctions = function() {

	var master = this

	var DEBUG = true

/// GLOBAL VIDEO VARS
	var videoDuration = 0, // SET on loadVideo
		playHeadPos = 0, //loadVideo resets to 0
		playSpeed = 0, // frame increments of video walktrhough
		delta = -1, // set by scroll direction
		autoScrollOff, 
		scrollTimeout, 
		videoLoaded = false,
		timeSliderIsSliding = false,
		timer = 0,
		walkcounter = 0

	master.percent = 0 // position in video a percentage

	var videoType = '.webm'

	var v = document.createElement('video');

	if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
	 	videoType = '.mp4';
	}

	if(v.canPlayType && v.canPlayType('video/webm').replace(/no/, '')) {
	 	videoType = '.webm';
	}

/// GLOBAL PATHS


	var dataDir = "data/",
		videoDir = "media/video/source/"

///SET UP MAIN CANVAS SCREEN


	var canvas = document.getElementById('video-canvas');
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	ctx.globalAlpha = .1

	var canvasUnderlay = document.getElementById('video-canvas-underlay');
	canvasUnderlay.width  = window.innerWidth;
	canvasUnderlay.height = window.innerHeight;
	var ctxUnderlay = canvasUnderlay.getContext('2d');
	ctxUnderlay.globalAlpha = .8

// GLOBAL POPCORN. EACH MOVIE CLIP WILL PULL IN CORRESPONDING JSON OBJECT
	var POPCORN = Popcorn( "#main-screen" );



	//context.globalCompositeOperation = 'destination-out';

	var hideVideo = function(videoName) {

		console.log('hide video')

		videoLoaded = false


	}

	var showVideo = function(videoName) {

		console.log('show video')

		videoLoaded = true


	}	

	var loadVideo = function(videoName) {


		videoLoaded = false

		POPCORN.destroy()

		POPCORN = Popcorn( "#main-screen" )

		// event listener functions



		// LOOKS FOR AND RETURNS RELATED DATA OBJECT

		var codeBlockArray = $.grep(master.dataMatrix['codeBlocks'], function(e) {
			return e.name == videoName;
		});

		var videoStartEvent,videoEndEvent

		if(codeBlockArray[0]){

			$(codeBlockArray[0]['code']).each( function(i,v){
				POPCORN.code(v)
			})

			videoStartEvent = codeBlockArray[0].onStart
			videoEndEvent = codeBlockArray[0].onEnd

		}

		var endEventFunction = function() {
			if(typeof videoEndEvent  === 'function')
				videoEndEvent()
		}

		var startEventFunction = function() {

			videoLoaded = true

			videoDuration = $("#main-screen")[0].duration

			playSpeed = 1/(videoDuration*60) // in frames!
			
			if(typeof videoStartEvent  === 'function')
				videoStartEvent()

		}

		$("#main-screen")[0].src = videoDir + videoName + videoType

		$("#main-screen")[0].load()

		playHeadPos = 0

		master.percent = 0

		$("#main-screen")[0].removeEventListener ('ended', function(){

			endEventFunction()

		},false)

		$("#main-screen")[0].removeEventListener ('canplaythrough', function(){

			startEventFunction()

		},false)

		$("#main-screen")[0].addEventListener ('ended', function(){

			endEventFunction()

		},false)

		$("#main-screen")[0].addEventListener ('canplaythrough', function(){

			startEventFunction()

		},false)

	}


	var setEvents = function(){

		$('#video-menu-toggle').on('click', function(){

			if (!$(this).hasClass('open')){

				$('#video-menu-toggle').html('Close Menu')
				$(this).addClass('open')
				$('#video-menu').fadeIn()
				return
			}

			if ($(this).hasClass('open')){
				$(this).removeClass('open')
				$('#video-menu').fadeOut()
			}

		})

		$('#video-menu ul li').on('click', function(){
			loadVideo($(this).html())
		})



   		$("#scroll-wrapper")[0].addEventListener("touchstart", touchStart, false);
		$("#scroll-wrapper")[0].addEventListener("touchend", touchEnd, false);
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

		$("#time-slider").slider();	

        $("#time-slider").slider({ start: function( event, ui ) {
			autoScrollOff = true
        }});

        $("#time-slider").slider({ stop: function( event, ui ) {
        	master.percent = ($("#time-slider").slider("value")/100)
			autoScrollOff = false
        }});

        // slider -> video
        $("#time-slider").slider({ slide: function( event, ui ) {

        	master.percent = ($("#time-slider").slider("value")/100)
            //$("#main-screen")[0].currentTime = $("#main-screen")[0].duration * ($("#time-slider").slider("value") / 100);
        }});
        
        // video -> slider
        $("#main-screen")[0].addEventListener("timeupdate", function() {
            var value = (100 / $("#main-screen")[0].duration) * $("#main-screen")[0].currentTime;   
            $("#time-slider").slider("value", value);
        });



		function scrollHandler(e){

			e.preventDefault();

	        delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); // -1 for down, 1 for up

	        master.percent -= (playSpeed*5) * delta

	        scrollFunction()

	        walkcounter += Math.abs(delta)

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
        screenRender()

	}

	var screenRender = function(){

        if(videoLoaded) {
        	ctxUnderlay.drawImage($("#main-screen")[0],0,0,window.innerWidth,window.innerHeight);
			ctx.drawImage($("#main-screen")[0],0,0,window.innerWidth,window.innerHeight);
		}else {
			ctxUnderlay.drawImage($("#black-screen")[0],0,0,window.innerWidth,window.innerHeight);
			ctx.drawImage($("#black-screen")[0],0,0,window.innerWidth,window.innerHeight);
		}		
		
			
	}

	var counter = 0
	var frameRunner = function() {

		//console.log($("#main-screen")[0].currentTime)

		requestAnimationFrame(frameRunner)

		if(DEBUG && $("#main-screen")[0].currentTime) $('#video-status').html ($("#main-screen")[0].currentTime.toFixed(2) + '/' + $("#main-screen")[0].duration.toFixed(2))

		if (!autoScrollOff) {

			if(master.percent <= 0) master.percent = 0.01
				else if(master.percent > 1) master.percent = 1

			master.percent -= (playSpeed*.05) * delta

			if(videoLoaded && counter % 10 == 0){
				$("#main-screen")[0].currentTime = videoDuration * master.percent
				screenRender()
			}
				

				

		}

		if(videoLoaded){
			if(walkcounter % 30 == 1) console.log("left")
			if(walkcounter % 60 == 1) console.log("right")
		}

		if(counter % 5 == 1){
			//screenRender()
		}
			

		counter ++

			
	}	

	this.init = function(){

		$('#still-screen').css('height',window.innerHeight)

		$('#still-screen img').width(window.innerWidth)

		//$('#still-screen img').css('margin-top',-200)

 		$.ajax({
            dataType: 'json',
            success: function(data) {
               
				$(data['children']).each(function(i,v){
					$('#video-menu ul').append('<li class="text-link">' + v.fileName +'</li>')
				})

				setEvents()

				//loadVideo('forest_reeds_01')

				frameRunner()

            },
            error: function(request,error){
                console.log("load data error: "+ error);
            },

            url: "data/directoryReader.php"
        });

	
	}

	this.dataMatrix = {
		codeBlocks:[
		{ //start video
			name: "forest_reeds_01",
			onStart: function() {console.log("this video has started")},
			onEnd: function() {console.log("this video has ended")},
			code:[ 
			{	//start block
				start: 3,
				end: 6,
				onStart: function( options ) {
					hideVideo()
				},
				onEnd: function( options ) {
					showVideo()
				}
			}, //end block
			{	//start block
				start: 3,
				end: 5,
				onStart: function( options ) {
					console.log("in2")
				},
				onEnd: function( options ) {
					console.log("out2")
				}
			}  //end block			
			]
		}//end video



		]
	}
}


$(document).ready(function(){
	var master = new masterFunctions();
    master.init();
});



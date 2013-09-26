;(function(window, undefined){
	var Mix, Track, debounce, on, off, trigger, solo, unsolo, log10, body;
	console.log("LOADED MIX")
	//~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Just a reference to the body element
	body = document.getElementsByTagName('body')[0];


	debounce = function(func, wait) {
	    var timeout;
	    return function() {
	        var context = this, args = arguments,
	        later = function() {
	            timeout = null;
	            func.apply(context, args);
	        };
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	    };
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utility function for binding events
	on = function( type, callback ){
		this.events[type] = this.events[type] || [];
		this.events[type].push( callback );
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utility function for removing all events of a given type
	off = function( type ){
		this.events[type] = [];
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utility function for trigger events
	trigger = function( type ){
		//console.log(type)
		if ( !this.events[type] ) return;
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, l = this.events[type].length; i < l;  i++)
			if ( typeof this.events[type][i] == 'function' ) 
				this.events[type][i].apply(this, args);
	};
		
	
	Mix = function(opts){

	  this.tracks = [];
	  this.gain =  1;
	  this.events = {};
	  this.lookup = {};

	  if(Modernizr.webaudio === true) {
	  	console.log('[MODERNIZR] Web Audio Supported')
	  	if ( typeof AudioContext === 'function' ) 
	  		this.context = new AudioContext();
	  	else 
	  		this.context = new webkitAudioContext();
	  } else {
	  	console.log('[MODERNIZR] Web Audio NOT SUPPORTED')
	  }

		
		
							
	}
	
	Mix.prototype.initMix = function(startTime){
		


	  this.startTime = startTime;
		var defaults = {};	

		this.on('load', function(){
			var total = this.tracks.length;
			this.loaded += 1;
			if ( total == this.loaded ){
				this.ready = true;
				this.trigger('ready');
			}
		});
				
	}
	
	Mix.prototype.createTrack = function(name, opts){

		if(Modernizr.webaudio === true) {

			console.log('[MODERNIZR] Creating web audio track')

			//if ( !name || this.lookup[name] ) return;
			var track = new Track(name, opts, this);
			
			this.tracks.push( track );
			this.lookup[name] = track;
			return track;
		} else {
			console.log('[MODERNIZR] no web audio, NOT creatin track')

			return false;
		}
		
		
	};

	Mix.prototype.getTrack = function(name){
		return this.lookup[name];
	};

	Mix.prototype.createTrackZero = function(name, opts){
		//if ( !name || this.lookup[name] ) return;
		var track = new Track(name, opts, this);
		
		this.tracks[0] =  track;
		this.lookup[name] = track;
		return track;
		
	};	
	
	Mix.prototype.pause = function(){
		var total = this.tracks.length;
		this.playing = false;
		for ( var i = 0; i < total; i++ )
			if ( this.tracks[i].ready ) this.tracks[i].pause();
		console.log(audiomaster.tracks)

	};


	
	Mix.prototype.extend = function(){
		var output = {}, args = arguments, l = args.length;
		for ( var i = 0; i < l; i++ )		
			for ( var key in args[i] )
				if ( args[i].hasOwnProperty(key) )
					output[key] = args[i][key];
		return output;
	};

	Mix.prototype.removeTrack = function(name){
		console.log("removing " + name)

		var rest, 
			arr = this.tracks, 
			total = arr.length;

		for ( var i = 0; i < total; i++ ){
			if ( arr[i] && arr[i].name == name ) {
				rest = arr.slice(i + 1 || total);
				arr.length = i < 0 ? total + i : i;
				arr.push.apply( arr, rest );
			}
		}

		this.lookup[name].pause()
		delete this.lookup[name];
	};	

	Mix.prototype.on = function(){
		on.apply(this, arguments);
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Unind all events of a given type from a Track instance
	Mix.prototype.off = function(){
		off.apply(this, arguments);
	};
		
	Mix.prototype.trigger = function(){
		trigger.apply(this, arguments);
	}

	// Set Master gain
	Mix.prototype.setGain = function( gain ){
		var total = this.tracks.length;
		this.gain = gain;
		for ( var i = 0; i < total; i++ )
			this.tracks[i].gain( this.tracks[i].gain() );
	};

/////////////TRACKZ

	Track = function(name, opts, mix){
		
		var self = this,
			defaults = {
				gain:  0,
				pan:   0,
				start: 0
			};
     

		this.options = Mix.prototype.extend.call(this, defaults, opts || {});
		this.name = name;
		this.events = {};
		this.ready = false;
		this.set('mix', mix);
		this.set('muted', false);
		this.set('soloed', false);
		this.set('afl', true);
		this.set('currentTime', 0);
		this.set('nolooping', this.options.nolooping);
		this.set('start', this.options.start);
		this.set('gainNode', this.get('mix').context.createGainNode());
		this.set('panner', this.get('mix').context.createPanner());
		this.get('panner').panningModel = webkitAudioPannerNode.EQUALPOWER;
		this.get('panner').setPosition(this.pan(),0,.1);
		this.set('gainCache', this.gain());


		if ( this.get('source') ) this.loadBuffer( this.get('source'));
					
  }



	Track.prototype.loadBuffer = function( source ){
 
		var self = this;

		var request = new XMLHttpRequest();
        request.open("GET", source, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {

        var audioData = request.response;

			self.set('source', self.get('mix').context.createBufferSource());
			self.set('sourceBuffer', self.get('mix').context.createBuffer(audioData,true));
			self.get('source').buffer = self.get('sourceBuffer')
			if(!self.get('nolooping')) self.get('source').loop = true
			
			self.get('source').connect(self.get('panner'));
			self.get('panner').connect(self.get('gainNode'));
			self.get('gainNode').connect(self.get('mix').context.destination);
			self.ready = true;
			self.get('mix').trigger('load', self);

			console.log("loading")


        };

        request.send();
		

	   
	};



	
	Track.prototype.play = function(){

		
	
		if ( !this.ready ){
			
			this.on('load', function(){
				this.play();
			});
			return;
		}

		if ( this.options.playing ) {
			
			return;
		} 


		if(this.ready && !this.options.playing) {
			
			this.options.playing = true;
			this.play();
		}
		
		//this.gain(this.options.gain)
	
		this.options.playing = true;

		var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod|Safari)/g) ? true : false;

		console.log(isIOS)

		if(isIOS){
			this.options.source.noteOn(this.options.start)
		}else{

			console.log(this.options.source)
			//this.options.source.noteOn(this.options.start)
			this.options.source.start(0,this.options.start)	
		}
		
		
		this.trigger('play');
		/**/
	};


	Track.prototype.pause = function(){
		this.options.playing = false;	
		this.options.source.noteOff(0);
		this.trigger('pause');
		console.log(this.options.playing)
	};
	
  ////////TRACKS UTILITIES

Track.prototype.on = function(){
		on.apply(this, arguments);
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Unind all events of a given type from a Track instance
	Track.prototype.off = function(){
		off.apply(this, arguments);
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Trigger events on a Track instance
	Track.prototype.trigger = function(){
		trigger.apply(this, arguments);
	}
	
	Track.prototype.trigger = function(){
		trigger.apply(this, arguments);
	}
		  
	Track.prototype.get = function(prop){
		return this.options[prop];
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Set a property value for a Track instance
	Track.prototype.set = function(prop, val){
		if ( typeof val === 'undefined' ) return;
		this.options[prop] = val;
		return this.options[prop];
	};
	

	Track.prototype.pan = function(val){
		if ( typeof val !== 'undefined' ) 
			this.get('panner').setPosition(val, 0, .1);
		this.set('pan', val)
		return this.get('pan') || 0;
	};
	

	Track.prototype.gain = function(val, override){
		var min = 0, max = 1, master = this.get('mix').gain;
		if ( typeof val !== 'undefined' && val >= min && val <= max ){
			this.set('gain', val);
			if ( !override ) this.set('gainCache', val);
			if ( !this.get('_muted') || override ) this.get('gainNode').gain.value = val * master;
		}
		return this.get('gain') || this.get('gainNode').gain.value;
	};
		
	//~~~~~~~~~~~~~~~~~~~~~~~~~
	// Return a reference to the Track instance's parent Mix (no setter)
	Track.prototype.mix = function(){
		return this.get('mix');
	} 
	
	window.Mix = Mix;
	
}(window));

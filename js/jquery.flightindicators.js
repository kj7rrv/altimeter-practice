/* 
* jQuery Flight Indicators plugin
* By Sébastien Matton (seb_matton@hotmail.com)
* Published under GPLv3 License.
* 
* https://github.com/sebmatton/jQuery-Flight-Indicators
*/
(function($) {
	function FlightIndicator( placeholder, type, options ) {
		// Initial configuration
		var attitude = this;
		var settings = $.extend({
			size : 200,
			roll : 0,
			pitch : 0,
			turn : 0,
			heading: 0,
			beaconred: 90,
			beaconredshow: true,
			beacongreen: 30,
			beacongreenshow: true,
			vario: 0,
			airspeed: 0,
			altitude: 0,
			pressure: 1000,
			pressure2: 0,
			showBox : true,
			img_directory : 'img/'
		}, options );

		var constants = {
			pitch_bound:30,
			vario_bound : 1.95,
			airspeed_bound_l : 0,
			airspeed_bound_h : 160
		}

		// Creation of the instrument
		placeholder.each(function(){
			switch(type){
				case 'heading':
					$(this).html('<div class="instrument heading"><div class="heading box"><img src="' + settings.img_directory + 'heading_yaw.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'heading_foreground.svg" class="box" alt="" /></div><div class="beaconred box"><img src="' + settings.img_directory + 'heading_beaconred.svg" class="box" alt="" /></div><div class="beacongreen box"><img src="' + settings.img_directory + 'heading_beacongreen.svg" class="box" alt="" /></div></div>');
					_setHeading(settings.heading);
					_setBeaconGreen(settings.beacongreen, settings.beacongreenshow);
					_setBeaconRed(settings.beaconred, settings.beaconredshow);
				break;
				case 'variometer':
					$(this).html('<div class="instrument vario"><img src="' + settings.img_directory + 'vertical_foreground.svg" class="box" alt="" /><div class="vario box"><img src="' + settings.img_directory + 'vertical_hand.svg" class="box" alt="" /></div><div class="mechanics box"></div></div>');
					_setVario(settings.vario);
				break;
				case 'turn_coordinator':
					$(this).html('<div class="instrument turn_coordinator"><img src="' + settings.img_directory + 'turn_coordinator_sep_b.svg" class="box" alt="" />            <div class="turn box"><img src="' + settings.img_directory + 'fi_tc_airplane.svg" class="box" alt="" /></div><div class="mechanics box"></div></div>');
					_setTurn(settings.turn);
				break;
				case 'airspeed':
					$(this).html('<div class="instrument airspeed"><img src="' + settings.img_directory + 'airspeed_foreground.svg" class="box" alt="" /><div class="speed box"><img src="' + settings.img_directory + 'generic_hand.svg" class="box" alt="" /></div><div class="mechanics box"></div></div>');
					_setAirSpeed(settings.airspeed);
				break
				case 'altimeter':
					$(this).html('<div class="instrument altimeter"><div class="pressure2 box"><img src="' + settings.img_directory + 'altitude_pressure2.svg" class="box" alt="" /></div><div class="pressure box"><img src="' + settings.img_directory + 'altitude_pressure.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'altitude_foreground.svg" class="box" alt="" /><div class="circlehand box"><img src="' + settings.img_directory + 'altitude_circular_hand.svg" class="box" alt="" /></div><div class="handSmall box"><img src="' + settings.img_directory + 'altitude_hour_hand.svg" class="box" alt="" /></div><div class="hand box"><img src="' + settings.img_directory + 'generic_hand.svg" class="box" alt="" /></div><div class="mechanics box"></div></div>');
					_setAltitude(settings.altitude);
					_setPressure(settings.pressure);
					_setPressure2(settings.pressure2);
				break;
				default:
					$(this).html('<div class="instrument attitude"><div class="roll box"><img src="' + settings.img_directory + 'horizon_back.svg" class="box" alt="" /><div class="pitch box"><img src="' + settings.img_directory + 'horizon_ball.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'horizon_circle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'horizon_foreground.svg" class="box" alt="" /></div></div>');
					_setRoll(settings.roll);
					_setPitch(settings.pitch);
			}
			$(this).find('div.instrument').css({height : settings.size, width : settings.size});
			$(this).find('div.instrument img.box.background').toggle(settings.showBox);
		});

		// Private methods
		function _setRoll(roll){
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll').css('transform', 'rotate('+roll+'deg)');
			});
		}

		function _setPitch(pitch){
			// alert(pitch);
			if(pitch>constants.pitch_bound){pitch = constants.pitch_bound;}
			else if(pitch<-constants.pitch_bound){pitch = -constants.pitch_bound;}
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll div.pitch').css('top', pitch*0.25 + '%');
			});
		}

		function _setHeading(heading){
			placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading').css('transform', 'rotate(' + -heading + 'deg)');
			});	
		}

		function _setBeaconRed(heading, visible){
			if (visible) placeholder.each(function(){
				$(this).find('div.instrument.heading div.beaconred').css('transform', 'rotate(' + heading + 'deg)');
			});	
		}		

		function _setBeaconGreen(heading, visible){
			if (visible) placeholder.each(function(){
				$(this).find('div.instrument.heading div.beacongreen').css('transform', 'rotate(' + heading + 'deg)');
			});	
		}				

		function _setTurn(turn){
			placeholder.each(function(){
				$(this).find('div.instrument.turn_coordinator div.turn').css('transform', 'rotate('+turn+'deg)');
				//$(this).find('div.instrument.turn_coordinator div.turn').css('background-color', 'rgb(12, 132, 237)');		// testing blue
				//$(this).find('div.instrument.turn_coordinator div.turn').css('background-image', 'url(file:///D:/hp/sager/CDOTedx/jQuery-Flight-Indicators-master/pathAnimator-master/img/ballbg.fw.png)');
			});
		}

		function _setVario(vario){
			if(vario > constants.vario_bound){vario = constants.vario_bound;}
			else if(vario < -constants.vario_bound){vario = -constants.vario_bound;}
			vario = vario*90;
			placeholder.each(function(){
				$(this).find('div.instrument.vario div.vario').css('transform', 'rotate(' + vario + 'deg)');
			});	
		}

		function _setAirSpeed(speed){
			if(speed > constants.airspeed_bound_h){speed = constants.airspeed_bound_h;}
			else if(speed < constants.airspeed_bound_l){speed = constants.airspeed_bound_l;}
			speed = 90+speed*2;
			placeholder.each(function(){
				$(this).find('div.instrument.airspeed div.speed').css('transform', 'rotate(' + speed + 'deg)');
			});	
		}

		// WIP
		function _setAltitude(altitude){
			//var hand = 90 + altitude%1000 * 360 / 1000;
			var hand = 90 + altitude / 100 * 360;
			var handSmall = altitude / 1000 * 360;
			var handCenter = altitude / 10000 * 360;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.hand').css('transform', 'rotate(' + hand + 'deg)');
				$(this).find('div.instrument.altimeter div.handSmall').css('transform', 'rotate(' + handSmall + 'deg)');
				$(this).find('div.instrument.altimeter div.circlehand').css('transform', 'rotate(' + handCenter + 'deg)');
			});	
		}

		function _setPressure(pressure){
			pressure = 2*pressure - 1980;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.pressure').css('transform', 'rotate(' + pressure + 'deg)');
			});	
		}

		// WIP
		function _setPressure2(pressure){
			pressure = 2*pressure - 1980;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.pressure2').css('transform', 'rotate(' + pressure + 'deg)');
			});	
		}		

		function _resize(size){
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : size, width : size});
			});
		}

		function _showBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').show();
			});
		}

		function _hideBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').hide();
			});
		}

		// Public methods
		this.setRoll = function(roll){_setRoll(roll);}
		this.setPitch = function(pitch){_setPitch(pitch);}
		this.setHeading = function(heading){_setHeading(heading);}
		this.setBeaconRed = function(heading, visible){_setBeaconRed(heading, visible);}
		this.setBeaconGreen = function(heading, visible){_setBeaconGreen(heading, visible);}
		this.setTurn = function(turn){_setTurn(turn);}
		this.setVario = function(vario){_setVario(vario);}
		this.setAirSpeed = function(speed){_setAirSpeed(speed);}
		this.setAltitude = function(altitude){_setAltitude(altitude);}
		this.setPressure = function(pressure){_setPressure(pressure);}
		this.setPressure2 = function(pressure){_setPressure2(pressure);}
		this.resize = function(size){_resize(size);}
		this.showBox = function(){_showBox();}
		this.hideBox = function(){_hideBox();}

		return attitude;
	};

	// Extension to jQuery
	$.flightIndicator = function(placeholder, type, options){
		var flightIndicator = new FlightIndicator($(placeholder), type, options)
		return flightIndicator;
	}

	$.fn.flightIndicator = function(data, type, options){
		return this.each(function(){
			$.flightIndicator(this, type, options);
		});
	}
}( jQuery ));

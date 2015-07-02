/* 
jQuery Flight Indicators Extended plugin
By Sébastien Matton (seb_matton@hotmail.com), Edward Hanna (edward.hanna@senecacollege.ca) and Raymond Blaga (raymond.blaga@gmail.com)

Published under GPLv3 License.

https://github.com/uw-ray/jQuery-Flight-Indicators
*/
(function($) {

	function FlightIndicator( placeholder, type, options ) {

		var built = true;

		var settings = $.extend({
			size : 400,
			roll : 0,
			pitch : 0,
			turn : 0,
			slip: 0,
			heading: 0,
			beaconone: 90,
			beacononeshow: true,
			beacontwo: 30,
			beacontwoshow: true,
			vario: 0,
			airspeed: 0,
			altitude: 0,
			pressure: 30,
			showBox : true,
			showScrews: true,
			img_directory : 'img/'
			}, options 
		);

		var constants = {
			pitch_bound:30,
			vario_bound : 1.95,
			airspeed_bound_l : 0,
			airspeed_bound_h : 160
		}

		// Creation of the instrument
		placeholder.each(function(){

			switch(type){

				case 'airspeed':
					$(this).html('<div class="instrument airspeed"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="airspeed_clock"><img src="' + settings.img_directory + 'airspeed_clock.svg" class="box" alt="" /></div><div class="airspeed box"><img src="' + settings.img_directory + 'airspeed_hand.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setAirSpeed(settings.airspeed);
				break

				case 'attitude':
					$(this).html('<div class="instrument attitude"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="attitude box"><img src="' + settings.img_directory + 'attitude_roll_1.svg" class="box" alt="" /><div class="attitude_pitch box"><img src="' + settings.img_directory + 'attitude_pitch.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'attitude_roll_2.svg" class="box" alt="" /></div><div class="attitude_foreground"><img src="' + settings.img_directory + 'attitude_foreground.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setRoll(settings.roll);
					_setPitch(settings.pitch);
				break

				case 'altimeter':
					$(this).html('<div class="instrument altimeter"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="altimeter_pressureinhg box"><img src="' + settings.img_directory + 'altimeter_pressure_inhg.svg" class="box" alt="" /></div><div class="altimeter_pressurembar box"><img src="' + settings.img_directory + 'altimeter_pressure_mbar.svg" class="box" alt="" /></div><div class="altimeter_background box"><img src="' + settings.img_directory + 'altimeter_background.svg" class="box" alt="" /></div><div class="altimeter_hand10000 box"><img src="' + settings.img_directory + 'altimeter_hand_10000ft.svg" class="box" alt="" /></div><div class="altimeter_foreground box"><img src="' + settings.img_directory + 'altimeter_foreground.svg" class="box" alt="" /></div><div class="altimeter_hand1000 box"><img src="' + settings.img_directory + 'altimeter_hand_1000ft.svg" class="box" alt="" /></div><div class="altimeter_hand100 box"><img src="' + settings.img_directory + 'altimeter_hand_100ft.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setAltitude(settings.altitude);
					_setPressure(settings.pressure);
				break;

				case 'turn_coordinator':
					$(this).html('<div class="instrument turn"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="turn_markings_1 box"><img src="' + settings.img_directory + 'turn_markings_1.svg" class="box" alt="" /></div><div class="turn_ball_path box"></div><div class="turn_ball box"><img src="' + settings.img_directory + 'turn_ball.svg" class="box" alt="" /></div><div class="turn_airplane box"><img src="' + settings.img_directory + 'turn_airplane.svg" class="box" alt="" /></div><div class="turn_markings_2 box"><img src="' + settings.img_directory + 'turn_markings_2.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setTurn(settings.turn);
					_setSlip(settings.slip);
				break;

				case 'heading':
					$(this).html('<div class="instrument heading"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="heading_background box"><img src="' + settings.img_directory + 'heading_background.svg" class="box" alt="" /></div><div class="heading_yaw box"><img src="' + settings.img_directory + 'heading_yaw.svg" class="box" alt="" /></div><div class="heading_beacon_2 box"><img src="' + settings.img_directory + 'heading_beacon_2.svg" class="box" alt="" /></div><div class="heading_beacon_1 box"><img src="' + settings.img_directory + 'heading_beacon_1.svg" class="box" alt="" /></div><div class="heading_markings box"><img src="' + settings.img_directory + 'heading_markings.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setHeading(settings.heading);
					_setBeaconTwo(settings.beacontwo, settings.beacontwoshow);
					_setBeaconOne(settings.beaconone, settings.beacononeshow);
				break;

				case 'variometer':
					$(this).html('<div class="instrument vario"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="vario_markings"><img src="' + settings.img_directory + 'vario_markings.svg" class="box" alt="" /></div><div class="vario_hand box"><img src="' + settings.img_directory + 'vario_hand.svg" class="box" alt="" /></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
					_setVario(settings.vario);
				break;

				default:
					built = false;
					console.log("No instrument built.");

			}

			$(this).find('div.instrument').css({height : settings.size, width : settings.size});
			$(this).find('div.instrument .indicator_background').toggle(settings.showBox);
			$(this).find('div.instrument .indicator_background_screws').toggle(settings.showScrews);

		});

		// Air Speed - Set air speed
		function _setAirSpeed(speed){
			if(speed > constants.airspeed_bound_h){speed = constants.airspeed_bound_h;}
			else if(speed < constants.airspeed_bound_l){speed = constants.airspeed_bound_l;}
			speed = speed*2;
			placeholder.each(function(){
				$(this).find('div.instrument.airspeed div.airspeed').css('transform', 'rotate(' + speed + 'deg)');
			});	
		}

		// Attitude - Set pitch
		function _setPitch(pitch){
			if(pitch>constants.pitch_bound) pitch = constants.pitch_bound;
			else if(pitch<-constants.pitch_bound) pitch = -constants.pitch_bound;
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.attitude div.attitude_pitch').css('top', pitch*0.25 + '%');
			});
		}

		// Attitude - Set roll
		function _setRoll(roll){
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.attitude').css('transform', 'rotate('+roll+'deg)');
			});
		}

		// Altimeter - Set altitude
		function _setAltitude(altitude){
			var hand100 = altitude / 100 * 360;
			var hand1000 = altitude / 1000 * 360;
			var hand10000 = altitude / 10000 * 360;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.altimeter_hand100').css('transform', 'rotate(' + hand100 + 'deg)');
				$(this).find('div.instrument.altimeter div.altimeter_hand1000').css('transform', 'rotate(' + hand1000 + 'deg)');
				$(this).find('div.instrument.altimeter div.altimeter_hand10000').css('transform', 'rotate(' + hand10000 + 'deg)');
			});	
		}

		// Altimeter - Set pressure (inHg by default; separate code for mbar)
		function _setPressure(pressure){

			// Code for inHg
			if (pressure >= 27.1 && pressure <= 33) {
				// 5 units = 9 degrees
				pressure1 = (925 - 33.8639 * pressure) * 1.8;
				placeholder.each(function(){
					$(this).find('div.instrument.altimeter div.altimeter_pressurembar').css('transform', 'rotate(' + pressure1 + 'deg)');
				});	
				// 0.1 units = 6 degrees
				pressure2 = (pressure - 27.1) * 60;
				placeholder.each(function(){
					$(this).find('div.instrument.altimeter div.altimeter_pressureinhg').css('transform', 'rotate(' + -pressure2 + 'deg)');
				});
			}

			// Code for milibars
			/*
			if (pressure >= 925 && pressure <= 1120) {
				// 5 units = 9 degrees
				pressure1 = (925 - pressure) * 1.8;
				placeholder.each(function(){
					$(this).find('div.instrument.altimeter div.altimeter_pressurembar').css('transform', 'rotate(' + pressure1 + 'deg)');
				});	
				// 0.1 units = 6 degrees
				pressure2 = (pressure * 0.0295300 - 27.1) * 60;
				placeholder.each(function(){
					$(this).find('div.instrument.altimeter div.altimeter_pressureinhg').css('transform', 'rotate(' + -pressure2 + 'deg)');
				});
			}
			*/

		}

		// Turn Coordinator - Set turn direction
		function _setTurn(turn){
			placeholder.each(function(){
				$(this).find('div.instrument.turn div.turn_airplane').css('transform', 'rotate('+ turn +'deg)');
			});
		}

		// Turn Coordinator - Set slip/skid factor
		function _setSlip(slip) {

			if (slip < 0) slip = 0;
			if (slip > 100) slip = 100;

			/*
			placeholder.each(function(){
				$(this).find('div.instrument.turn_coordinator div.ball').css('transform', 'rotate('+ slip +'deg)');
			});
			*/

		}

		// Heading - Set heading
		function _setHeading(heading){
			placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading_yaw').css('transform', 'rotate(' + -heading + 'deg)');
			});	
		}

		// Heading - Set beacon one direction
		function _setBeaconOne(heading, visible){
			if (visible) placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading_beacon_1').show().css('transform', 'rotate(' + heading + 'deg)');
			});	
			else placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading_beacon_1').hide();
			});
		}		

		// Heading - Set beacon two direction
		function _setBeaconTwo(heading, visible){
			if (visible) placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading_beacon_2').show().css('transform', 'rotate(' + heading + 'deg)');
			});	
			else placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading_beacon_2').hide();
			});
		}

		// Variometer - Set vertical speed
		function _setVario(vario){
			if(vario > constants.vario_bound){vario = constants.vario_bound;}
			else if(vario < -constants.vario_bound){vario = -constants.vario_bound;}
			vario = vario*90;
			placeholder.each(function(){
				$(this).find('div.instrument.vario div.vario_hand').css('transform', 'rotate(' + vario + 'deg)');
			});	
		}

		// Set size of instrument
		function _resize(size){
			var sz = (size < 100) ? sz = 100 : sz = size;
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : sz, width : sz});
			});
		}

		// Toggle background box for instrument
		function _toggleBox(toggle){
			placeholder.each(function(){
				$(this).find('.indicator_background').toggle(toggle);
			});
		}

		// Toggle dashboard screws for instrument
		function _toggleScrews(toggle){
			placeholder.each(function(){
				$(this).find('.indicator_background').toggle(toggle);
			});
		}

		// Public methods
		this.setAirSpeed = function(speed){_setAirSpeed(speed);}
		this.setRoll = function(roll){_setRoll(roll);}
		this.setPitch = function(pitch){_setPitch(pitch);}
		this.setAltitude = function(altitude){_setAltitude(altitude);}
		this.setPressure = function(pressure){_setPressure(pressure);}
		this.setTurn = function(turn){_setTurn(turn);}
		this.setSlip = function(slip){_setSlip(slip);}
		this.setHeading = function(heading){_setHeading(heading);}
		this.setBeaconOne = function(heading, visible){_setBeaconOne(heading, visible);}
		this.setBeaconTwo = function(heading, visible){_setBeaconTwo(heading, visible);}
		this.setVario = function(vario){_setVario(vario);}
		this.resize = function(size){_resize(size);}
		this.toggleBox = function(toggle){_toggleBox(toggle);}
		this.toggleScrews = function(toggle){_toggleScrews(toggle);}

		return built;
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

/*----------------------------------------------------------
	Page Configuration
-----------------------------------------------------------*/
(function(){
	
	//(This is the first back and forth path the looks OK)
	// keep path below -->
	//var path = "m 150.54289,198.67678 c -28.85472,-1.59591 -48.47376,-4.56812 -75.249995,-9.625 25.554815,4.83809 49.954965,7.46666 76.249995,9.625 28.6127,-1.69167 48.10481,-4.23501 74.25,-9.625 -26.40966,5.29362 -46.84143,7.18083 -73.36244,9.66919";
	
	var path = "m 168.94779,198.40274 c -16.99342,-0.78104 -44.04823,-1.2666 -57.34886,-2.87742 27.13412,3.951 56.11426,2.69642 81.16555,-1.36059 -11.82679,2.47525 -6.6107,1.64478 -15.98323,3.42096";
		firstWalkerObj = $('.maze > .walker')[0],
		walkers = [],
		increment = 0,
		turn_coordinator = $.flightIndicator('#turn_coordinator', 'turn_coordinator', {turn:0, size : 300});
	
	// handles whatever moves along the path
	function AnimateWalker(walker){
		this.pathAnimator = new PathAnimator( path );
		this.walker = walker;
		this.reverse = false;
		this.speed = 3;
		this.easing = 't*(9-t)';
		this.startOffset = null;
		this.color = 'deeppink'; // visually separate different walkers easily
	}

	AnimateWalker.prototype = {
		start : function(){
			//this.walker.style.cssText = "";
			this.startOffset = (this.reverse || this.speed < 0) ? 100 : 0; // if in reversed mode, then animation should start from the end, I.E 100%
			this.pathAnimator.context = this; // just a hack to pass the context of every Walker inside it's pathAnimator
			this.pathAnimator.start( this.speed, this.step, this.reverse, this.startOffset, this.finish, this.easing);
		},

		// Execute every "frame"
		step : function(point, angle){
			this.walker.style.cssText = "top:" + point.y + "px;" + 
										"left:" + point.x + "px;" + 
										"transform:rotate(" + angle + "deg);" +
										"-webkit-transform:rotate(" +  angle + "deg);" ; //+
										/*"color:" + this.color + ";" ; /*+
										"background-image:" + "url(file:///D:/hp/sager/CDOTedx/jQuery-Flight-Indicators-master/pathAnimator-master/img/ballbg.fw.png);" ;*/
										
		},

		// Restart animation once it was finished
		finish : function(){
			this.start();
		},
		
		// I try to end this thing
		nowEnd : function(){
			
			this.startOffset = (this.reverse || this.speed < 0) ? 100 : 0; // if in reversed mode, then animation should start from the end, I.E 100%
			this.pathAnimator.context = this; // just a hack to pass the context of every Walker inside it's pathAnimator
			this.pathAnimator.start( 0, this.step, this.reverse, this.startOffset, this.finish, 0);
		},
		
		// I am trying a next curve
		nextCurve : function(path){
			
			this.pathAnimator = new PathAnimator( path );
			//this.walker = walker;
			this.reverse = false;
			this.speed = 3;
			this.easing = 't*(9-t)';
			this.startOffset = null;
			this.color = 'deeppink'; // visually separate different walkers easily
		},

		// Resume animation from the last completed percentage (also updates the animation with new settings' values)
		resume : function(){
			this.pathAnimator.start( this.speed, this.step, this.reverse, this.pathAnimator.percent, this.finish, this.easing);
		}
	}

	function generateWalker(walkerObj){
		var newAnimatedWalker = new AnimateWalker( walkerObj );
		walkers.push(newAnimatedWalker);
		return newAnimatedWalker;
	}

	// start "animating" the first Walker on the page
	/* generateWalker(firstWalkerObj).start(); */
	// bind the first Controller to the first Walker
	/* var firstController = $('menu > div:first');
	resetController( firstController );
	firstController.data( 'walker', walkers[0] ); */

/*-----------------------------------------------------------
	User Controls
------------------------------------------------------------*/
	$('#showPath').on('change', togglePath);
	$('#addWalker').on('click', addWalker);
	$('menu')
		.on('click', '.delete', removeInstance)
		.on('click', '.stopPlay', stopPlay)
		.on('click', '.reverse', switchDirection)
		.on('change', '.speed', changeSpeed)
		.on('change', 'select', changeEasing);
		
	$("#turnCoordinatorRollButton").on("click", startTurningCordinator);
		
	$('.speed').trigger('change');
	
	// show / hide the path of the animated object
	function togglePath(){
		$('#svgPath').toggleClass('show');
	}
	
	// add a new instance Walker and his controller box
	function addWalker(){
		var newWalker = firstWalkerObj.cloneNode(true),
			controllerTemplate = $('menu > div:last'),
			controllerClone = controllerTemplate.clone(),
			newAnimatedWalker = generateWalker(newWalker),
			color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		
		resetController( controllerClone );
		controllerTemplate.after( controllerClone.css('borderColor', color) );
		
		$(firstWalkerObj).after(newWalker);

		controllerClone.data('walker', newAnimatedWalker);  // keep track which controller controls which walker
		newAnimatedWalker.color = color;
		newAnimatedWalker.start();
	}
	// reset the controller box for new "walker" instances
	function resetController(obj){
		var speed = 30;
		obj.find('.speed').val(speed).next().text(speed + 's');
		obj.find(':checkbox').removeAttr('checked');
	}
	
	// pause or place the animated object along the path 
	function stopPlay(){
		var thisAnimatedWalker = $(this.parentNode.parentNode).data('walker');
		
		thisAnimatedWalker.pathAnimator.running ? thisAnimatedWalker.pathAnimator.stop() : thisAnimatedWalker.resume.apply(thisAnimatedWalker);
	}
	
	// switch direction of the animated object 
	function switchDirection(){
		var thisAnimatedWalker = $(this.parentNode.parentNode).data('walker');
		thisAnimatedWalker.reverse = (thisAnimatedWalker.reverse == true) ? false : true;
		if( thisAnimatedWalker.pathAnimator.running )
			thisAnimatedWalker.resume.apply(thisAnimatedWalker);
	}

	function changeSpeed(){
		var thisAnimatedWalker = $(this.parentNode).data('walker');
		thisAnimatedWalker.speed = this.value;
		this.nextElementSibling.innerHTML = this.value + 's';
		thisAnimatedWalker.resume.apply(thisAnimatedWalker);
	}

	function removeInstance(){
		var parent = $(this.parentNode),
			thisAnimatedWalker = parent.data('walker');
		
		// make sure at least one Walker stays
		if( walkers.length > 1 ){
			parent.remove();
			thisAnimatedWalker.pathAnimator.stop();
			$(thisAnimatedWalker.walker).remove();
			walkers.splice(walkers.indexOf(thisAnimatedWalker), 1);
		}
	}
	
	function changeEasing(){
		var thisAnimatedWalker = $(this.parentNode).data('walker'),
			easingFunc = ''; 
			
		if( this.value ){
			var formula = this.value;
			easingFunc = function(t){ return eval(formula) }; 
		}
		
		thisAnimatedWalker.easing = easingFunc;
		thisAnimatedWalker.resume.apply(thisAnimatedWalker);
	}
	
	function startTurningCordinator(){
	
		$(".walker").show();
		$(".overWalker").hide();
		$("#turnCoordinatorRollButton").attr('disabled', true);
		$(".stopPlay").show();
		$(".stopPlay").attr('disabled', true);
		$("#turnCoordinatorRollButton").text("Playing");
	
		doTurnCordinatorWork();
		
		startTurningCordinatorGen();
	
	}
	
	function doTurnCordinatorWork(){

		var myInterval = setInterval(function() {

			// Attitude update
			turn_coordinator.setTurn((30*Math.sin(increment/10))*-1);
			
			increment++;
			
			if(increment == 64){
				clearInterval(myInterval);
				$("#turnCoordinatorRollButton").attr('disabled',false);
				$("#turnCoordinatorRollButton").text("Start");
				increment = 0;
				$(".stopPlay").attr('disabled', false);
				//$( ".stopPlay" ).trigger( "click" );
				walkers[0].nowEnd();
				walkers.splice(0 /*DIRECTION 1*/, 1);
				
				
				$(".walker").hide();
				$(".overWalker").show();
				
			}

		}, 50);

	}
	
	function startTurningCordinatorGen(){
	
		// start "animating" the first Walker on the page
		generateWalker(firstWalkerObj).start();
	
	}
	
	function sleep(milliseconds) {
		var start = new Date().getTime();
			for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
			  break;
			}
		}
	}
	
	// reset checkboxes
	$(':checkbox').removeAttr('checked');
	$('select').prop('selectedIndex', 0);
})();
function buyBars( bars, wrappers, money )
{
	
	cost = 3;
	
	// buy bars
	newBars = Math.floor( money / cost);
	money = money - newBars*cost;
	bars = bars + newBars;
	
	wrappers = wrappers + newBars;
	
	// trade in
	tradeIN = Math.floor( wrappers / 3);
	bars = bars + tradeIN;
	wrappers = wrappers - tradeIN*3;
	wrappers = wrappers + tradeIN;
	
	console.log( bars, wrappers, money );
	
	if( wrappers >= 3 || money >= 3 )
	{
		return buyBars( bars, wrappers, money );
	}
	else
	{
		return {
			bars: bars,
			wrappers: wrappers,
			money: money
		}
	}
	
	// return {
		// wrappers: 
	// }
}

$(document).ready( function() {
	_.templateSettings = {
	  interpolate : /\{\{(.+?)\}\}/g
	};
	
	console.log( 'app ready to go' );
	
	$('#prompt .content').html( _.template($('#template-hello').html(), {name: 'Bob'}) );
	
	
	$('#start').click( function() {
		// $('#prompt').slideUp();
		// $('#loading').slideDown();
		
		dollars = $('#dollars').val();
		
		// bars = buyBars( 0, dollars );
		
		alert(( buyBars( 0, 0, dollars ).bars ))
		
		return false;
	});
});
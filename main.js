var loglevel;
// action
var log2;

var layout;
var scoreboard;
var bso;
var ballpark;

var runners = [null,null,null];
var defenders = [1,2,3,4,5,6,7,8,9];

var status_message;

	   
function init_once() {
    // log
    loglevel=0;
    log2=1;
    
    if(loglevel > 0)
	alert("init_once");
    
    // clear session Storage
    var storage, jstr;    
    storage = window.sessionStorage;
    storage.clear();

    // clear message
    status_message='';
    jstr = toJson(status_message);
    storage.setItem('Message',jstr);

    // ScoreBoardData
    // nameA, nameB, x, y, width, height
    //
    var sbd;
    sbd = new ScoreBoardData([null,null,null,null,null,null,null,null,null,null],
			     [null,null,null,null,null,null,null,null,null,null],
			     [[],[],[],[],[],[],[],[],[],[]],
			     [[],[],[],[],[],[],[],[],[],[]]);			     
    jstr = toJson(sbd);
    storage.setItem('ScoreBoardData',jstr);

    // TeamData
    var tda = new TeamData('桐光',
			   ['桐光1','桐光2','桐光3','桐光4','桐光5',
			    '桐光6','桐光7','桐光8','桐光9']);
    var tdb = new TeamData('厚木',
			   ['厚木1','厚木2','厚木3','厚木4','厚木5',
			    '厚木6','厚木7','厚木8','厚木9']);

    jstr = toJson(tda);
    storage.setItem('TeamAData',jstr);
    jstr = toJson(tdb);
    storage.setItem('TeamBData',jstr);    

    // BSOData
    var bso1 = new BSOData();
    jstr = toJson(bso1);
    storage.setItem('BSOData',jstr);    

}
// end of init_once

function init() {
    var storage=window.sessionStorage;
    if(loglevel > 0)    
	alert("init");

    // windows layout
    layout=new Layout();
    var homex=layout.homex;
    var homey=layout.homey;    
    var park_size=layout.park_size;
    var space=layout.space;

    // ScoreBoard
    sb = new ScoreBoard(layout.scorex,
			layout.scorey,
			layout.scorewidth,
			layout.scoreheight);
    var sbd = fromJson(storage.getItem('ScoreBoardData'));

    if(loglevel > 0)
	alert("init:Score Board Data is "+storage.getItem('ScoreBoardData'));

    sb.scoreA = sbd.scoreA;
    sb.scoreB = sbd.scoreB;
    sb.actionA = sbd.actionA;
    sb.actionB = sbd.actionB;
    // global
    scoreboard = sb;

    // BSO
    var bso1 = new BSO(layout.bsox,layout.bsoy,
		       layout.bsowidth,layout.bsoheight);
    var bsoData=JSON.parse(storage.getItem('BSOData'));

    if(loglevel > 0)
	alert("init:BSO Data is "+storage.getItem('BSOData'));

    bso1.which = bsoData.which;
    bso1.inning= bsoData.inning;
    bso1.point = bsoData.point;
    bso1.runner = bsoData.runner;
    bso1.ball = bsoData.ball;
    bso1.strike = bsoData.strike;
    bso1.out = bsoData.out;

    // global
    bso = bso1;
    // update point
    scoreboard.set_point(bso.which,bso.inning,bso.point);
    
    

    // Team A
    // nameA, x, y, width, height
    var teamA = new Team(layout.teamx, layout.teamy,
			 layout.teamwidth, layout.teamheight);
    var teamAData=JSON.parse(storage.getItem('TeamAData'));
    var players = teamAData.batting_order_name;

    if(loglevel > 0)
	alert("init:TeamA Data is "+storage.getItem('TeamAData'));
    
    teamA.current_batter = teamAData.current_batter;
    teamA.name = teamAData.name;
    teamA.batting_order_name =teamAData.batting_order_name;
    
    for (var i=1; i<10;i++){
	teamA.register(i,new Player(players[i-1]));
    }
    // Scoreboard includes team object
    sb.teamA = teamA;
    
    // Team B
    // nameA, x, y, width, height
    var teamB = new Team(layout.teamx, layout.teamy,
			 layout.teamwidth, layout.teamheight);
    var teamBData=JSON.parse(storage.getItem('TeamBData'));
    var players = teamBData.batting_order_name;

    if(loglevel > 0)
	alert("init:TeamB Data is "+storage.getItem('TeamBData'));

    teamB.current_batter = teamBData.current_batter;
    teamB.name = teamBData.name;
    teamB.batting_order_name =teamBData.batting_order_name;
    
    for (var i=1; i<10;i++){
	teamB.register(i,new Player(players[i-1]));
    }
    // Scoreboard includes team object
    sb.teamB = teamB;
    
    // draw scoreboard, team, bso
    sb.draw();
    bso.draw();    
    if(bso.which == 'A'){
	teamA.draw();
	teamA.spot_team();
	teamA.spot_order(teamA.current_batter);
    }else {
	teamB.draw();
	teamB.spot_team();
	teamB.spot_order(teamB.current_batter);
    }
    // end of draw 

    // Ball Park
    // x,y, park_size, fall_space
    var bp = new Ballpark(homex,homey,park_size,space);
    bp.draw();
    // global
    ballpark=bp;

    // Batter
    var tmp_size=10;
    var batter1 = new Batter(homex-2*tmp_size,
			     homey-space-tmp_size,
			     park_size,tmp_size);
    batter1.draw();
    // ballpark includes batter object
    bp.batter=batter1;

    // draw runner
    // x,y, park_size, runner_size, ruikan
    tmp_size=10;
    var runner1;
    for(var i=0; i<3; i++){
	if( bso.runner[i] != 0){
	    runner1 = new Runner(homex,homey-space,park_size,tmp_size,1/2);
	    // ballpark includes runner object
	    bp.runners[i]=runner1;
	    
	    switch(i){
	    case 0:
		runner1.move('1B');
		break;
	    case 1:
		runner1.move('2B');
		break;
	    case 2:
		runner1.move('3B');
		break;				
	    }
	    runner1.draw();	    
	}
    }
    
    // draw defender
    // x,y,park_size,defender_size,ruikan
    tmp_size=10;
    var pos_name = ['P','C','1B','2B','3B','SS','LF','CF','RF'];
    var def1;

    for(var i=0;i<9;i++){
	def1 = new Defender(homex,homey-space,park_size,tmp_size,1/2);	
	def1.position_name=pos_name[i];
	def1.position=i+1;
	def1.draw();
	// ballpark includes defender object
	bp.defenders[i]=def1;
    }

    // Message
    var message=document.getElementById("area1");
    var str =storage.getItem('Message');
    message.innerText = str;
    
    var elems = null;
    var labels = null;

    elems = document.getElementsByClassName('elements');
    labels = document.getElementsByClassName('label');

    if(elems){
	for( var i =0; i < elems.length; i++){
	    elems[i].style.display ="none";
	}
	for( var i=0; i < labels.length ; i++){
	    labels[i].onclick = showBlock;
	}
    }
    
}
// end of init

function showBlock(event){
    //alert("SB "+event);
    var theEvent = event? event:window.event;
    var theSrc = theEvent.target ? theEvent.target : theEvent.srcElement;
    var itemId = "elements" + theSrc.id.substring(5);
    var item =document.getElementById(itemId);
    //alert("showblock toggle");
    if(item.style.display=='none'){
	item.style.display='block';
    }else{
	item.style.display='none';
    }
    
}


function test1(event){
    alert("close popup"+event);
    var theEvent = event? event:window.event;
    alert("close popup1"+theEvent);
    var theSrc = theEvent.target ? theEvent.target : theEvent.srcElement;
    alert("close popup2"+theSrc);
    var itemId = "elements" + theSrc.id.substring(5);
    alert("close popup3"+itemId);
    var item =document.getElementById(itemId);
    alert("close popup4"+item);

}


function get_canvas_context(which){
    if( which == 1){
	return layout.canvas1_context;
    }else if( which == 2){
	return layout.canvas2_context;
    }else {
	alert("set_canvas");
    }
}

function tategaki(context,text,x,y){
    var textList = text.split('\n');
    var lineHeight = context.measureText("あ").width;
    textList.forEach(function(elm,i){
	Array.prototype.forEach.call(elm,function(ch,j){
	    context.fillText(ch,x-lineHeight*i,y+lineHeight*j);
	});
    });
}

// 
function main(){
    var canvas = document.getElementById("canvas2");
    canvas.addEventListener('click',dispatch_main,false);
    var btn=document.getElementById('btn1');
    btn.addEventListener('click',menu1,false);
    var btn=document.getElementById('btn2');
    btn.addEventListener('click',menu2,false);
}

function dispatch_main(e){
    var button = e.target.getBoundingClientRect();
    var mouseX = e.clientX - button.left;
    var mouseY = e.clientY - button.top;
    var storage=window.sessionStorage;
    var jstr;

    var acctiondata=null;
    var action=null;

    var message=document.getElementById("area1");

    actiondata=storage.getItem('ActionData');
    if(actiondata != null){
	if(loglevel > 0)	
	    alert("dispatch_main not null:"+actiondata);
	storage.removeItem('ActionData');
	actiondata =JSON.parse(actiondata);
	action= new Action(); 
	action.set_data(actiondata);
    }else {
	if(loglevel > 0)
	    alert("dispatch_main null");
    }

    //alert("(" + mouseX + "," + mouseY + ")");

    var batter1 = ballpark.batter;
    if(batter1.isClick(mouseX,mouseY)){
	alert("Batter Clicked!");
    }

    //alert("runners:"+ballpark.runners);

    for(var i=0;i<3;i++){
	if(ballpark.runners[i] != null){
	    if(ballpark.runners[i].isClick(mouseX,mouseY))
		alert("runner Clicked!:"+i+":");
	}
    }

    var defenders=ballpark.defenders;

    //alert("defenders:"+defenders);
    
    for(var i=0;i<9;i++){
	var def=defenders[i];
	var ball_pos = def.isClickPos(mouseX,mouseY);
	
	if(ball_pos){
	    if(log2 != 0){
		alert("dipatch_main:defender:"+def.position_name+" "+ball_pos);
		alert("dipatch_main:action.defenders:"+action.defenders+
		      ":length:"+action.defenders.length);
		alert("dipatch_main:action.action_num:"+action.action_num);
	    }

	    if(action != null){
		switch(action.action_num){
		case 0:
		    break;
		case 1:
		    if(action.defenders.length == 0){
			// 1st & last  defender who contacts the ball
			action.defenders=[[def.position, ball_pos]];
			jstr = JSON.stringify(action);
			var num = action.getNumToBase();
			var cuurent_batter = scoreboard.get_current_batter(bso.which);
			// create runner and put him on 'num' base
			
			
			
		    }else{
			// last defender who contacts the ball
			// can not specify the ball position
			action.defenders.push([def.position,0]);
			jstr = JSON.stringify(action);
		    }
		    //alert("end of input:"+jstr);
		    message.innerText = jstr;
		    break;
		case 2:
		    if(log2 != 0)
			alert("action num 2");
		    if(action.defenders.length == 0){
			// 1st defender who contacts the ball
			action.defenders=[[def.position, ball_pos]];
			action.action_num--;
			jstr = JSON.stringify(action);
			storage.setItem('ActionData',jstr);
		    }else{
			alert("action num 2 error");
		    }
		    message.innerText = jstr;
		    break;
		}
	    }
	}
    }
}

function menu1(event){
    if(loglevel > 0)
	alert("menu1 "+event);
    
    var message=document.getElementById("area1");
    var str;
    
    var opts = document.getElementById("someForm").getElementsByTagName("input");
    var choice_num=0;
    var choices = [null];

    for(var i=0;i<opts.length;i++){
	if(opts[i].checked){
	    var val = opts[i].value;
	    choices[choice_num]= val;
	    choice_num++;
	}
    }

    if(choice_num != 1)
	alert("Error:menu1 choice number is "+choice_num);

    
    if(loglevel > 0)
	alert("menu1:action data0:");
    
    var ad = new ActionData();
    var a = new Action();
    var jstr;

    ad.hit_out=choices[0];
    ad.fly_liner_grounder=null;
    ad.defenders=null;
    a.set_data(ad);
    var action_num = a.get_action_num();

    if(action_num == 0){
	// no need async process
	// update out count (K,SO...)
	// update runner    (Four Ball, Dead Ball,...)
	switch(ad.hit_out){
	case 'K':
	case 'SO':	    	    
	    // update out count
	    updateOutCount();
	    str = "SO";
	    break;
	case 'FB':
	case 'DB':
	    // update runner
	    updateRunner();
	    str = "FB";
	    break;
	default:
	    alert("error in menu1");
	}
	status_message = str;
 	registerOneScore(ad);
    }else {
	// need async process
	storage.setItem('score',jstr);
	alert("test2 score= "+jstr);
    }


}
function updatePoint(){
    bso.point++;
    scoreboard.set_point(bso.which,bso.inning,bso.point);
}

function updateOutCount(){
    // 
    // 1. count up  outcount
    //    increase batting order
    // 2. change inning
    //    increase batting order

    if(loglevel > 0)
	alert('updateOutCount out:'+bso.out+':which:'+bso.which+
	      ':scoreboard:'+scoreboard.teamA);
    
    if(bso.out<2){
	bso.out++;
	scoreboard.current_batter_increase(bso.which);

    }else{
	if(loglevel > 0)
	    alert('change!');
	scoreboard.current_batter_increase(bso.which);	
	scoreboard.set_point(bso.which,bso.inning,bso.point);	
 	bso.change();
	
	
    }
    
    if(loglevel > 0)
	alert('end of updateOutCount');
    
}

function updateRunner(){
    // batter gets to 'num' base
    //
    // 1,2,3,4
    //
    // 1. create runner and put him on 1st base
    //
    // bso.runner =
    // 1 [0,0,0]->[1,0,0]
    // 1 [0,0,0]->[1,0,0]
    // 1 [0,0,0]->[1,0,0]
    //
    // 2 [0,0,1]->[1,0,1]
    // 3 [0,1,0]->[1,1,0]
    // 4 [1,0,0]->[1,1,0]
    // 5 [0,1,1]->[1,1,1]
    // 6 [1,1,0]->[1,1,1]
    // 7 [1,0,1]->[1,1,1]    
    // 8 [1,1,1]->[1,1,1]   +1
    //
    //
    for(var i=0;i<1;i++){
	if(bso.runner[0] == 0 && bso.runner[1]==0 && bso.runner[2]==0){
	    // 0,0,0
	    if(loglevel > 0)
		alert('updateRunner #1');
	    var current_batter = scoreboard.get_current_batter(bso.which);
	    bso.runner[0]=current_batter;
	    break;
	}
	if(bso.runner[0] != 0 && bso.runner[1]==0 && bso.runner[2]==0){
	    // 1,0,0
	    if(loglevel > 0)
		alert('updateRunner #4');
	    var current_batter = scoreboard.get_current_batter(bso.which);
	    bso.runner[1]=bso.runner[0]
	    bso.runner[0]=current_batter;
	    break;
	}
	if(bso.runner[0] != 0 && bso.runner[1]!=0 && bso.runner[2]==0){
	    // 1,1,0
	    if(loglevel > 0)
		alert('updateRunner #6');		
	    var current_batter = scoreboard.get_current_batter(bso.which);
	    bso.runner[2]=bso.runner[1]
	    bso.runner[1]=bso.runner[0]
	    bso.runner[0]=current_batter;
	    break;	    
	}
	if(bso.runner[0] != 0 && bso.runner[1]!=0 && bso.runner[2]!=0){
	    // 1,1,1
	    if(loglevel > 0)
		alert('updateRunner #8');		
	    var current_batter = scoreboard.get_current_batter(bso.which);
	    bso.runner[2]=bso.runner[1]
	    bso.runner[1]=bso.runner[0]
	    bso.runner[0]=current_batter;
	    //
	    updatePoint();
	    break;	    
	}
    }
    
    scoreboard.current_batter_increase(bso.which);    	
    return;
    
}
// end of updateRunner

//
// batter menu
//
function menu2(event){
    if(loglevel > 0)    
	alert("menu2 "+event);
    var opts = document.getElementById("someForm").getElementsByTagName("input");
    var choice_num=0;
    var choices = [null, null];

    for(var i=0;i<opts.length;i++){
	if(opts[i].checked){
	    var val = opts[i].value;
	    //alert("test2 checked is ..."+i+","+val);
	    choices[choice_num]= val;
	    choice_num++;
	}
    }
    if(choice_num != 2)
	alert("Error:test2 choice number is "+choice_num);


    var ad = new ActionData();
    var a = new Action();
    
    ad.hit_out=choices[0];
    ad.fly_liner_grounder=choices[1];
    ad.defenders=[];
    a.set_data(ad);

    var action_num = a.get_action_num();
    registerOneScore(ad);
    
    var storage=window.sessionStorage;
    var jstr;
    
    jstr = JSON.stringify(a);    
    storage.setItem('ActionData',jstr);

    if(log2 != 0)
	alert("menu2:action data:"+jstr);

}

// Persistent Storage
function registerOneScore(actiondata){
    // global
    // bso, scoreboard
    var jstr;
    var storage = window.sessionStorage;

    if(loglevel > 0)
	alert('registeronescore1 ');
    jstr = JSON.stringify(bso);
    
    if(loglevel > 0)
	alert('registeronescore to persistent:BSOData:'+jstr);
    storage.setItem('BSOData',jstr);

    jstr = JSON.stringify(scoreboard);
    if(loglevel > 0)    
	alert('registeronescore to persistent:ScoreBoardData:'+jstr);    
    storage.setItem('ScoreBoardData',jstr);

    jstr = JSON.stringify(scoreboard.teamA);
    if(loglevel > 0)
	alert('registeronescore to persistent:TeamA:'+jstr);    
    storage.setItem('TeamAData',jstr);

    jstr = JSON.stringify(scoreboard.teamB);
    if(loglevel > 0)
	alert('registeronescore to persistent:TeamB:'+jstr);    
    storage.setItem('TeamBData',jstr);

}

function inningToIndex(inning){
    switch(inning){
    case 'top1st':
    case 'bot1st':	
	return 0;
    case 'top2nd':
    case 'bot2nd':	
	return 1;
    case 'top3rd':
    case 'bot3rd':	
	return 2;
    case 'top4th':
    case 'bot4th':	
	return 3;
    case 'top5th':
    case 'bot5th':	
	return 4;
    case 'top6th':
    case 'bot6th':	
	return 5;
    case 'top7th':
    case 'bot7th':	
	return 6;
    case 'top8th':
    case 'bot8th':	
	return 7;
    case 'top9th':
    case 'bot9th':	
	return 8;
    default:
	alert('error inningToIndex');
    }
}

function inningGetNext(inning){
    var list={"top1st":"bot1st","bot1st":"top2nd",
	      "top2nd":"bot2nd","bot2nd":"top3rd",
	      "top3rd":"bot3rd","bot3rd":"top4th",
	      "top4th":"bot4th","bot4th":"top5th",
	      "top5th":"bot5th","bot5th":"top6th",
	      "top6th":"bot6th","bot6th":"top7th",
	      "top7th":"bot7th","bot7th":"top8th",
	      "top8th":"bot8th","bot8th":"top9th",
	      "top9th":"bot9th","bot9th":"top10th",
};
    return list[inning];
}

function toJson(value){
    return JSON.stringify(value,replacer);

    function replacer(k,v){
	if(typeof v === 'function'){
	    return v.toString();
	}
	return v;
    }
}

function fromJson(value){
    return JSON.parse(value,reviver);
    function reviver(k,v){
	if(typeof v === 'string' && v.match(/^function/)){
	    return Function.call(this, 'return ' + v)();
	}
	return v;
    }
}

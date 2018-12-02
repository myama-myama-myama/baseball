var ActionData = function(){
    this.hit_out=null;
    this.fly_liner_grounder=null;
    this.defenders=null;
    this.action_num=0;
}

var Action =function() {
    this.hit_out=null;
    this.fly_liner_grounder=null;
    this.defenders=null;
    this.action_num=0;

    this.set_data = function(data){
	this.hit_out = data.hit_out;
	this.fly_liner_grounder=data.fly_liner_grounder;
	this.defenders=data.defenders;
	this.action_num=data.action_num;
    }

    this.getNumToBase = function(){
	// return number that runner gets to by hitting
	if(log2 != 0)
	    alert("getNumToBase");
	
	switch(this.hit_out){
	case 'FB':
	case 'DB':
	case 'Hit1':
	    return 1;
	case 'Hit2':
	    return 2;
	default:
	    alert("error getNumToBase");
	}
	return false;
    }
    
    this.get_action_num =function (){
	if(loglevel>0)
	    alert("get_action_num:");
	switch(this.hit_out){
	    // pitcher menu
	case 'FB':
	case 'DB':
	    this.action_num=0;
	    break;
	case 'K':
	case 'SO':
	    this.action_num=0;
	    break;
	    // batter menu
	case 'Out1':
	    // Grounder,Band ...2
	    // Liner,Fly ...1
	    // error 1 or 2 ?
	    alert("Out1:"+this.fly_liner_grounder);
	    switch(this.fly_liner_grounder){
	    case 'Grounder':
		this.action_num=2;
		return 2;
	    case 'Liner':
		this.action_num=1;
		return 1;
	    default:
		alert("OUT1");
	    }
	    break;
	case 'Hit4':
	    this.action_num=0;
	    break;
	case 'Hit1':
	case 'Hit2':
	case 'Hit3':
	case 'OutGisei':	
	    this.action_num=1; 
	    break;

	case 'Out2':
	    this.action_num=2; 
	    break;
	case 'Out3':
	    this.action_num=2; 
	    break;
	default:
	    alert("action_num");
	}
	return this.action_num;
    }

    
}
// end of Action

var Layout = function(){
    // canvas
    this.canvas1;
    this.canvas1_context;
    this.canvas2;
    this.canvas2_context;    
    // ball park
    this.homex=250;
    this.homey=400;
    this.park_size=200;
    this.space=50;
    // score board
    this.scorex=0;
    this.scorey=0;
    this.scorewidth=500;
    this.scoreheight=100;
    //  batting order
    this.teamx=0;
    this.teamy=100;
    this.teamwidth=400;
    this.teamheight=100;
    //  BSO board
    this.bsox=this.teamwidth;
    this.bsoy=this.teamy;
    this.bsowidth=this.scorewidth-this.teamwidth;
    this.bsoheight=this.teamheight;

    // layout
    this.canvas1 = document.getElementById("canvas1");
    this.canvas1.width=500;
    this.canvas1.height=200;
    this.canvas1_context=this.canvas1.getContext("2d");
    
    this.canvas2 = document.getElementById("canvas2");
    this.canvas2.width=500;
    this.canvas2.height=400;
    this.canvas2_context=this.canvas2.getContext("2d");

}
// end of Layout

var Player = function(name){
    this.name=name;
    var batter;
    var runner;
    var defender;
    var score;
}

// for Storage
var ScoreBoardData = function(scoreA,scoreB,actionA,actionB){
    this.scoreA = scoreA;
    this.scoreB = scoreB;
    this.actionA = actionA;
    this.actionB = actionB;
}

var ScoreBoard = function(x,y,width,height){
    var ctx;
    var inning = [1,2,3,4,5,6,7,8,9,0];
    // horizon:4+10=14
    // vertical:1+1+1=3
    var h_unit=14,v_unit=4;
    var unit_width = width/h_unit;
    var unit_height = height/v_unit;
 
    //   alert("score board "+"("+x+","+y+")("+width+","+height+")");
    // obj
    this.teamA = null; 
    this.teamB = null; 
    this.scoreA =  [1,2,3,4,5,6,7,8,9,0];
    this.scoreB =  [1,2,3,4,5,6,7,8,9,0];
    this.actionA = [[],[],[],[],[],[],[],[],[],[]];
    this.actionB = [[],[],[],[],[],[],[],[],[],[]];    
    
    ctx = get_canvas_context(1);

    
    this.current_batter_increase = function(which){
	if(which == 'A'){
	    this.teamA.current_batter_increase();
	}else {
	    this.teamB.current_batter_increase();
	}
    }

    this.get_current_batter = function(which){
	if(which == 'A'){
	    return this.teamA.current_batter;
	}else {
	    return this.teamB.current_batter;
	}
    }
	
    this.set_point = function(which,inning_name,point){
	if( which == 'A'){
	    this.scoreA[inningToIndex(inning_name)]=point;
	}else{
	    this.scoreB[inningToIndex(inning_name)]=point;
	}
    }
    this.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = "black";
	// x,y, width, height
	ctx.fillRect(x,y,width,height);
	ctx.font="16px 'MS ゴシック'";
	ctx.fillStyle ="white";
	// text, x, y, maxWidth
	// team name
	ctx.fillText(this.teamA.name,
		     x+unit_width, y+2*unit_height,
		     3*unit_width);
	ctx.fillText(this.teamB.name,
		     x+unit_width, y+3*unit_height,
		     3*unit_width);
	// inning
	var inning=['一','二','三','四','五','六','七','八','九','計'];
	for(var i=0; i<10;i++){
	    ctx.fillText(inning[i],
			 x+unit_width*4+unit_width*i, y+unit_height,
			 unit_width);
	    if(this.scoreA[i] != null){
		ctx.fillText(this.scoreA[i],
			     x+unit_width*4+unit_width*i, y+2*unit_height,
			     unit_width);
	    }
	    if(this.scoreB[i] != null){	    
		ctx.fillText(this.scoreB[i],
			     x+unit_width*4+unit_width*i, y+3*unit_height,
			     unit_width);
	    }
	}
	
    }
    
}
// for Storage
var TeamData =function(name,batting_order_name){
    this.current_batter = 1;
    this.name = name;
    this.batting_order_name=batting_order_name;
}
//
var Team = function(x,y,width,height){
    var ctx;
    this.current_batter;
    this.name = null;
    this.batting_order_name;
    var batting_order = [1,2,3,4,5,6,7,8,9];
    // horizon:4+9=13
    // vertical:team:2+2+2=6
    //          name:1+4+1=6
    var h_unit=13,v_unit=6;
    var unit_width = width/h_unit;
    var unit_height = height/v_unit;
    // spot vertical
    var spot_width=unit_width*2;
    var spot_height=5;
    
    ctx = get_canvas_context(1);    
    
    this.register = function(order,player){
	batting_order[order-1]=player;
    }

    this.current_batter_increase =function(){
	this.current_batter++;
	if(this.current_batter == 10){
	    this.current_batter=1;
	}
    }
    
    this.spot_team = function(){
	ctx.beginPath();	
	ctx.fillStyle = "red";
	ctx.fillRect(x+unit_width,y+unit_height*5,
		     spot_width,spot_height);
    }
    this.spot_order = function(order){
	var index = order-1;
	ctx.beginPath();	
	ctx.fillStyle = "red";
	ctx.fillRect(x+unit_width*4+unit_width*index,
		     y+unit_height*5,
		     unit_width*0.7,spot_height);
    }
    this.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = "black";
	// x,y, width, height
	ctx.fillRect(x,y,width,height);
	ctx.font="16px 'MS ゴシック'";
	ctx.fillStyle ="white";
	// text, x, y, maxWidth
	// team name
	ctx.fillText(this.name,
		     x+unit_width, y+3*unit_height,
		     3*unit_width);
	// batting order
	var order=['一','二','三','四','五','六','七','八','九'];
	for(var i=0; i<9;i++){
	    ctx.fillText(order[i],
			 x+unit_width*4+unit_width*i,
			 y+unit_height,
			 unit_width);
	    tategaki(ctx,batting_order[i].name,
		     x+unit_width*4+unit_width*i,
		     y+unit_height*2.5);
	}
    }
}
// for Storage
var BSOData = function(){
    this.which='A';
    this.inning='top1st';
    this.point=0;
    this.runner=[0,0,0];
    this.ball=0;
    this.strike=0;
    this.out=0;
}
var BSO = function(x,y,width,height){
    // horizon:1+4+1=6
    // vertical:1+1+1=3
    var h_unit=6,v_unit=4;
    var unit_width = width/h_unit;
    var unit_height =height/v_unit;
    
    this.which;
    this.inning;
    this.point;
    this.runner;
    this.runnerObj=[null,null,null];
    this.ball;
    this.strike;
    this.out;
    var ctx;
    ctx = get_canvas_context(1);

    this.change = function() {
	if(this.which == 'A'){
	    this.which = 'B';
	}else{
	    this.which = 'A';
	}
	
	// increase inning
	this.inning = inningGetNext(this.inning);
	if( this.inning == "top10th")
	    alert("end of game");
	
	// clear count
	this.point=0;
	this.runner=[0,0,0];
	this.ball=0;
	this.strike=0;
	this.out=0;	    
    }
    
    this.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = "black";
	// x,y, width, height
	ctx.fillRect(x,y,width,height);
	ctx.font="16px 'MS ゴシック'";
	ctx.fillStyle ="white";
	ctx.fillText('B',
		     x+unit_width, y+unit_height,
		     unit_width);
	ctx.fillText('S',
		     x+unit_width, y+2*unit_height,
		     unit_width);
	ctx.fillText('O',
		     x+unit_width, y+3*unit_height,
		     unit_width);

	var size=6;

	ctx.beginPath();	    
	for(var i=1;i<=this.ball;i++){
	    ctx.arc(x+unit_width+i*unit_width+size/2,
		    y+unit_height-size/1.5,
		    size,0,2*Math.PI);
	    ctx.fillStyle ="lightgreen";
	    ctx.fill();
	}

	var size=6;
	ctx.beginPath();	    
	for(var i=1;i<=this.strike;i++){
	    ctx.arc(x+unit_width+i*unit_width+size/2,
		    y+2*unit_height-size/1.5,
		    size,0,2*Math.PI);
	    ctx.fillStyle ="orange";
	    ctx.fill();
	}

	var size=6;
	ctx.beginPath();	    	
	for(var i=1;i<=this.out;i++){
	    ctx.arc(x+unit_width+i*unit_width+size/2,
		    y+3*unit_height-size/1.5,
		    size,0,2*Math.PI);
	    ctx.fillStyle ="red";
	    ctx.fill();
	}

    }
    
}

var Batter = function(batter_homex,batter_homey,park_size,batter_size){
    var ctx;

    this.number=1;
    var right_left = "right";
    // range = [left,up, right,down]
    this.range = [0,0,0,0];    
    var size = batter_size;

    ctx = get_canvas_context(2);
    
    this.isClick = function(x,y){
	/*
	  alert("isClick(" + x + "," + y + ")"
	  + range[0] + "," + range[1]+ ":"
	  + range[2] + "," + range[3]
	  );
	*/
	if( ( this.range[0] <= x && this.range[1] <= y ) &&
	    ( this.range[2] >= x && this.range[3] >= y))
	    return true;
	else
	    return false;

    }
    
    
    this.draw = function(){
	//alert("batter draw");
	ctx.beginPath();
	ctx.arc(batter_homex,batter_homey,size,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle ="blue";
	ctx.fill();
	this.range = [batter_homex-0.5*size,batter_homey-0.5*size,
		      batter_homex+0.5*size,batter_homey+0.5*size];
	
    }
}

var Runner = function(x,y,park_size,runner_size,ruikan){
    var ctx;
    this.base = '1B';
    var homex=x;
    var homey=y;
    var range = [0,0,0,0];

    ctx = get_canvas_context(2);
    
    this.isClick = function(x,y){
	if( ( range[0] <= x && range[1] <= y ) &&
	    ( range[2] >= x && range[3] >= y))
	    return true;
	else
	    return false;
    }
    this.move = function(base){
	this.base=base;
    }
    this.draw = function(){
	switch(this.base){
	case '1B':
	    base_x=homex+ruikan*park_size-2*runner_size;
	    base_y=homey-ruikan*park_size-runner_size;
	    break;
	case '2B':
	    base_x=homex-2*runner_size;
	    base_y=homey-1.8*ruikan*park_size+runner_size;
	    break;
	case '3B':
	    base_x=homex-ruikan*park_size+2*runner_size;
	    base_y=homey-ruikan*park_size+2*runner_size;
	    break;
	default:
	    break;
	}

	ctx.beginPath();
	ctx.arc(base_x,base_y,runner_size,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle ="blue";
	ctx.fill();
	range = [base_x-0.5*runner_size,
		 base_y-0.5*runner_size,
		 base_x+0.5*runner_size,
		 base_y+0.5*runner_size];
    }
}

var Defender = function(x,y,park_size,defender_size,ruikan){
    var ctx;
    this.position_name = 'P';
    this.position=1;
    var def_size=defender_size;
    var u_range = [0,0,0,0];
    var d_range = [0,0,0,0];
    var r_range = [0,0,0,0];
    var l_range = [0,0,0,0];

    ctx = get_canvas_context(2);
    
    this.position = function(pos){
	this.position=pos;
    }

    this.isClick = function(x,y){
	/*
	alert("def isClick(" + x + "," + y + ")"
	      + " u: " 
	      + u_range[0] + "," + u_range[1]+ ":"
	      + u_range[2] + "," + u_range[3]
	      + " d: " 
	      + d_range[0] + "," + d_range[1]+ ":"
	      + d_range[2] + "," + d_range[3]
	      + " r: " 
	      + r_range[0] + "," + r_range[1]+ ":"
	      + r_range[2] + "," + r_range[3]
	      + " l: " 
	      + l_range[0] + "," + l_range[1]+ ":"
	      + l_range[2] + "," + l_range[3]
	     );
	*/
	if( (( u_range[0] <= x && u_range[1] <= y ) &&
	     ( u_range[2] >= x && u_range[3] >= y )) ||
	    (( d_range[0] <= x && d_range[1] <= y ) &&
	     ( d_range[2] >= x && d_range[3] >= y )) ||
	    (( r_range[0] <= x && r_range[1] <= y ) &&
	     ( r_range[2] >= x && r_range[3] >= y )) ||
	    (( l_range[0] <= x && l_range[1] <= y ) &&
	     ( l_range[2] >= x && l_range[3] >= y )))
	    return true;
	else
	    return false;
    }
    
    this.isClickPos = function(x,y){
	if( (( u_range[0] <= x && u_range[1] <= y ) &&
	     ( u_range[2] >= x && u_range[3] >= y )))
	    return 'up';
	if( (( d_range[0] <= x && d_range[1] <= y ) &&
	     ( d_range[2] >= x && d_range[3] >= y )))
	    return 'down'
	if( (( r_range[0] <= x && r_range[1] <= y ) &&
	     ( r_range[2] >= x && r_range[3] >= y )))
	    return 'right'
	if( (( l_range[0] <= x && l_range[1] <= y ) &&
	     ( l_range[2] >= x && l_range[3] >= y )))
	    return 'left';
	return false;
    }
    
    
    this.draw = function(){
	var radian = Math.PI/4/4;
	var fall_line_radian= Math.PI/4;
	switch(this.position_name){
	case 'P':
	    def_x=x;
	    def_y=y-ruikan*park_size-1.2*def_size;
	    break;
	case 'C':
	    def_x=x;
	    def_y=y+def_size;
	    break;
	case '1B':
	    def_x=x+1.8*ruikan*park_size*Math.cos(fall_line_radian+radian);
	    def_y=y-1.8*ruikan*park_size*Math.sin(fall_line_radian+radian);
	    break;
	case 'RF':
	    def_x=x+2.8*ruikan*park_size*Math.cos(fall_line_radian+2*radian);
	    def_y=y-2.8*ruikan*park_size*Math.sin(fall_line_radian+2*radian);
	    break;		  		  		  
	case '2B':
	    def_x=x+2.2*ruikan*park_size*Math.cos(fall_line_radian+3*radian);
	    def_y=y-2.2*ruikan*park_size*Math.sin(fall_line_radian+3*radian);
	    break;
	case 'CF':
	    def_x=x;
	    def_y=y-3*ruikan*park_size;
	    break;		  		  		  
	case 'SS':
	    def_x=x-2.2*ruikan*park_size*Math.cos(fall_line_radian+3*radian);
	    def_y=y-2.2*ruikan*park_size*Math.sin(fall_line_radian+3*radian);
	    break;
	case 'LF':
	    def_x=x-2.8*ruikan*park_size*Math.cos(fall_line_radian+2*radian);
	    def_y=y-2.8*ruikan*park_size*Math.sin(fall_line_radian+2*radian);
	    break;		  		  		  
	case '3B':
	    def_x=x-1.8*ruikan*park_size*Math.cos(fall_line_radian+radian);
	    def_y=y-1.8*ruikan*park_size*Math.sin(fall_line_radian+radian);
	    break;
	default:
	    alert("unknown position");
	    break;
	}

	ctx.beginPath();
	ctx.arc(def_x,def_y,def_size,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle ="red";
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(def_x,def_y,def_size*4,0,2*Math.PI);	      
	ctx.moveTo(def_x,def_y);
	ctx.lineTo(def_x+def_size*4*Math.cos(Math.PI/4),
		   def_y-def_size*4*Math.sin(Math.PI/4));

	ctx.moveTo(def_x,def_y);
	ctx.lineTo(def_x-def_size*4*Math.cos(Math.PI/4),
		   def_y-def_size*4*Math.sin(Math.PI/4));

	ctx.moveTo(def_x,def_y);
	ctx.lineTo(def_x-def_size*4*Math.cos(Math.PI/4),
		   def_y+def_size*4*Math.sin(Math.PI/4));

	ctx.moveTo(def_x,def_y);
	ctx.lineTo(def_x+def_size*4*Math.cos(Math.PI/4),
		   def_y+def_size*4*Math.sin(Math.PI/4));

	ctx.lineWidth =0.5;
	ctx.strokeStyle ="#f0f0f0"
	ctx.stroke();	      

	u_range = [def_x-def_size,
		   def_y-3*def_size,
		   def_x+def_size,
		   def_y];

	l_range = [def_x-3*def_size,
		   def_y-def_size,
		   def_x,
		   def_y+def_size];

	d_range = [def_x-def_size,
		   def_y,
		   def_x+def_size,
		   def_y+3*def_size];

	r_range = [def_x,
		   def_y-def_size,
		   def_x+3*def_size,
		   def_y+def_size];
    }	  
}

var Ballpark = function(x,y,size,fall_space){
    var ctx;
    var homex=x;
    var homey=y;
    var space = fall_space;
    var centerdepth=2;

    // obj
    this.batter=null;
    //obj
    this.defenders=[1,2,3,4,5,6,7,8,9];
    //obj
    this.runners=[null,null,null]; 


    ctx = get_canvas_context(2);
    
    this.draw = function(){
	var tmpx,tmpy;

	ctx.beginPath();
	ctx.moveTo(homex,homey);
	tmpx=homex+size;
	tmpy=homey-size;
	ctx.lineTo(tmpx,tmpy);
  	ctx.moveTo(tmpx,tmpy);
	tmpx=homex;
	tmpy=homey-centerdepth*size;
	ctx.quadraticCurveTo(homex+0.85*size,
			     homey-centerdepth*size,tmpx,tmpy);
  	ctx.moveTo(tmpx,tmpy)
	tmpx=homex-size;
	tmpy=homey-size;
	ctx.quadraticCurveTo(homex-0.85*size,
			     homey-centerdepth*size,tmpx,tmpy);
	ctx.moveTo(homex,homey);
	ctx.lineTo(homex-size,homey-size);
	//ctx.stroke();
	ctx.fillStyle ="green";
	ctx.fill();
	
	ctx.moveTo(homex,homey);
	ctx.lineTo(homex+size,homey-size);
	ctx.lineTo(homex,homey-centerdepth*size);
	ctx.lineTo(homex-size,homey-size);
	ctx.fill();	  
	
	// draw fall line
	homex=homex;
	homey=homey-space;
	ctx.lineWidth =2;
	
	ctx.beginPath();
	ctx.moveTo(homex,homey);
	ctx.lineTo(homex+size,homey-size);
	ctx.moveTo(homex,homey);
	ctx.lineTo(homex-size,homey-size);
	ctx.strokeStyle ="white";
	ctx.stroke();
	
	
	
	// draw base
	var ruikan=1/2;
	var basesize=15;
	
	ctx.fillStyle ="white";
	
  	ctx.beginPath();
	//first 1B
	ctx.fillRect(homex+ruikan*size-basesize,  homey-ruikan*size,
		     basesize,basesize);
	// second 2B
	ctx.fillRect(homex-0.5*basesize,  homey-1.8*ruikan*size,
		     basesize,basesize);		       
	// thrid 3B
	ctx.fillRect(homex-ruikan*size,homey-ruikan*size,
		     basesize,basesize);
	ctx.moveTo(homex,homey-ruikan*size);
	ctx.strokeStyle ="white";
	ctx.stroke();
	
	// pitcher
	ctx.beginPath();
	ctx.moveTo(homex-0.5*basesize,homey-ruikan*size);
	ctx.lineTo(homex+0.5*basesize,homey-ruikan*size);
	ctx.lineWidth =4;
	ctx.strokeStyle ="white";
	ctx.stroke();
	
	// homebase
	//ctx.strokeStyle ="red";
	ctx.beginPath();
	ctx.moveTo(homex,homey);
	ctx.lineTo(homex+0.5*basesize,homey-0.5*basesize);
	ctx.lineTo(homex+0.5*basesize,homey-basesize);
	ctx.lineTo(homex-0.5*basesize,homey-basesize);
	ctx.lineTo(homex-0.5*basesize,homey-0.5*basesize);
	ctx.lineTo(homex,homey);
	ctx.fillStyle ="white";
	ctx.fill();
	
	//ctx.stroke();
	/*
  	  ctx.moveTo(400,280);
	  ctx.quadraticCurveTo(350,350,300,300);
	  ctx.moveTo(400,400);
	  ctx.lineTo(300,300);
	*/
    }
}

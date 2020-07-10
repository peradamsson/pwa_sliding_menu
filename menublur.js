window.addEventListener("load",_=>new Runner);

function Runner(){
	const $=this;
	$.init=_=>{
		$.createStructure();
		new MenuBlur({
			menuSpawner:$.menuSpawner,
			menuOwner:$.menuOwner,
			log:$.log //Can be skipped, nothing will be logged -PA
		});
	}
	$.createStructure=_=>{
		$.create({id:"output"});
		$.create({id:"menuSpawner",tabIndex:0});
		$.create({id:"menuOwner",tabIndex:0});
		output.addEventListener("click",e=>output.innerHTML="");
	}
	$.log=(text,newBlock=false)=>{
		let div=document.createElement("div");
		div.innerText=text;
		if(newBlock)div.style.marginTop="10px";
		$.output.appendChild(div);
	}
	$.create=(params)=>{
		let{id,tabIndex}=params;
		let div=document.createElement("div");
		if(id)div.id=id;
		if(id)$[id]=div;
		if(id)div.innerText=id;
		if(tabIndex!==undefined)div.tabIndex=tabIndex;
		document.body.appendChild(div);
		return div;
	}
	$.init();
}

// TODO Make MenuBlur check for tabIndex and set it to 0 if necessary
function MenuBlur(params){
	const{menuSpawner,menuOwner,log=_=>{}}=params;
	const $=this;
	let states={HIDDEN:1,SHOWN:2,HIDING:3,SHOWING:4};
	let state=states.HIDDEN;
	$.isHidden=_=>state===states.HIDDEN;
	$.isShown=_=>state===states.SHOWN;
	$.isHiding=_=>state===states.HIDING;
	$.isShowing=_=>state===states.SHOWING;
	$.setHidden=_=>$.setState(states.HIDDEN);
	$.setShown=_=>$.setState(states.SHOWN);
	$.setHiding=_=>$.setState(states.HIDING);
	$.setShowing=_=>$.setState(states.SHOWING);
	$.setState=newState=>{
		if(!newState)console.error(`Unknown state:${newState.toString()}`);
		state=newState;
		log(Object.keys(states)[newState-1]);
	}
	$.init=_=>{
		$.createBodyEvents();
		$.createMenuSpawnerEvents();
		$.createMenuOwnerEvents();
	}
	$.hide=_=>{
		if($.isHiding())return;
		$.setHiding();
		menuOwner.style.transform="translateX(-100%)"
	}
	$.show=_=>{
		if($.isShowing())return;
		$.setShowing();
		menuOwner.style.transform="translateX(0%)"
		menuOwner.focus();
	}
	$.createBodyEvents=_=>{
		document.body.addEventListener("touchstart",e=>{
			log("Event: BODY TOUCHSTART",true);
			if($.isTargetNotAffectingMenuOwner(e.target))return;
			if($.isShown())$.hide();
		});
	}
	// $.isTargetNotAffectingMenuOwner=target=>target===menuSpawner||target===menuOwner;
	$.isTargetNotAffectingMenuOwner=target=>{
		if(target===menuSpawner)return true;
		if(target===menuOwner)return true;
		if(menuSpawner.contains(target))return true;
		if(menuOwner.contains(target))return true;
		return false;
	}
	$.createMenuSpawnerEvents=_=>{
		menuSpawner.addEventListener("click",e=>{
			log("Event: MENUSPAWNER CLICK");
			$.isHidden()||$.isHiding()?$.show():$.hide();
		});
	}
	$.createMenuOwnerEvents=_=>{
		menuOwner.addEventListener("click",e=>$.hide());
		menuOwner.addEventListener("blur",$.blur);
		menuOwner.addEventListener("transitionend",e=>$.isHiding()?$.setHidden():$.setShown());
	}
	$.blur=e=>{
		log("Event: MENUOWNER BLUR");
		console.log(e.relatedTarget,menuSpawner);
		if(e.relatedTarget===menuSpawner)return;
		$.hide();
	}
	$.init();
}

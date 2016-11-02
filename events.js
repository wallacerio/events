/**
 * Events - v.1.0 : 02/11/2016
 * Code organization
 * 
 * Author: Wallace Rio <wallrio@gmail.com>
 * 
 */

(function(){

	
	var Functions = {
		listContext:Object(),
		addEvent:function(objs,event,callback,mode){            
            var args = Array();			           
            for (var i = 4; i < arguments.length; i++) {            	
			    var argsString = argsString || '';
			    argsString += "'"+arguments[i]+"'" + ((i<arguments.length-1)?',':'');			    
			}			

            if(mode == undefined)
                mode = true;

            if(objs == undefined)
                objs = window; 
            if(objs.addEventListener){              
                return objs.addEventListener(event,function(e){
                    if(callback){
                    	if(argsString == undefined)
                    		eval("callback(objs,e);");
                    	else
                    		eval("callback(objs,e,"+argsString+");");
                    }
                    	
                },mode); 
            }else if(objs.attachEvent){
                return objs.attachEvent('on'+event,function(e){
                    if(callback){
                    	if(argsString == undefined)
                    		eval("callback(objs,e);");
                    	else
                    		eval("callback(objs,e,"+argsString+");");
                    }
                }); 
            }
        }, 
		AssocElement:function(){
			
			
				
				var obj = Object();
								

					var dataEventsArray = document.querySelectorAll('[data-events]');
					for(var i=0;i<dataEventsArray.length;i++){
						var elementTag = dataEventsArray[i];
						var data = elementTag.getAttribute('data-events');
						var dataArray = data.split(':');
						var el_context = dataArray[0];
						var el_func = dataArray[1];
						var el_event = dataArray[2] || 'click';
							
						var checkInit = elementTag.getAttribute('data-eventsinit');
						if(checkInit != '1'){
							elementTag.setAttribute('data-eventsinit','1');
						}

						if(el_func.indexOf('(') != -1){
							eval("elementTag['on"+el_event+"'] = function(){ events.context('"+el_context+"')."+el_func+";}");
						}else{
							elementTag["on"+el_event] = function(){events.context(el_context,el_func).callback()};
						}										
					}
					

				setTimeout(function(){
					Functions.AssocElement();				
				},1000);
		
		},

		init:function(){

			this.addEvent(window,'load',function(el,e){
				Functions.AssocElement();				
			});

			
		},
		context:function(context,options){
			if(options == undefined){
				
				var obj = Object();
				
					for(key in this.listContext){
						if(context == key){
							for(key2 in this.listContext[key]){
								
								obj[key2] = this.listContext[key][key2].callback;
							}														
						}
					}
									
				return obj;
			}

			if(typeof options == 'string'){
				
				var obj = Object();
				
					for(key in this.listContext){
						if(context == key){
							for(key2 in this.listContext[key]){								
								obj[key2] = this.listContext[key][key2];
							}														
						}
					}
									

				return obj[options];
			}

			var index = 0;
			for(key in options){			
				if(this.listContext[context] == undefined)
					this.listContext[context] = Object();

				this.listContext[context][key] = options[key];
				index++;
			}	

			

			for(key in Functions.listContext){
						
					for(key2 in Functions.listContext[key]){
						var elevents = Functions.listContext[key][key2].events || 'click';
						var elements = Functions.listContext[key][key2].elements || null;
						var callback = Functions.listContext[key][key2].callback;
						var eventsArray = elevents.split(',');
						if(elements != null){
							var elementsArray = elements.split(',');
							for(var i=0;i<elementsArray.length;i++){
								var elementsUnit = elementsArray[i];							
								for(var a=0;a<eventsArray.length;a++){
									var eventUnit = eventsArray[a];
									document.querySelector(elementsUnit)["on"+eventUnit] = callback;
								}
							}
						}								
					}														
			
			}

		
		}
	};

	Functions.init();

	window.events = Functions;
})();

